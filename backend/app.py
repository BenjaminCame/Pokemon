from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from sqlQuerys import create,insert,values

app = Flask(__name__)
CORS(app)

DB_NAME = "pokemonDB"

def get_db_connection():
   conn = sqlite3.connect(DB_NAME)
   conn.row_factory = sqlite3.Row  # to return dict-like rows
   return conn

def init_db():
 conn = get_db_connection()
 cursor = conn.cursor()
 cursor.execute(create)
 cursor.executemany(insert, values)
 conn.commit()
 conn.close()

@app.route('/cards', methods=['GET'])
def get_cards():
   conn = get_db_connection()
   cards = conn.execute('SELECT * FROM cards').fetchall()
   conn.close()
   return jsonify([dict(row) for row in cards])

@app.route('/decks', methods=['GET'])
def get_decks():
    conn = get_db_connection()
    decks = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name != 'cards' AND name NOT LIKE 'sqlite_%';").fetchall()
    conn.close()
    return jsonify([row['name'] for row in decks])

@app.route('/deck/<string:deck_id>', methods=['GET'])
def get_deck(deck_id):
    if not deck_id:
        return jsonify({'error': 'Deck ID is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if deck exists
    query = f'SELECT name FROM sqlite_master WHERE type="table" AND name=?'
    deck_exists = cursor.execute(query, (deck_id,)).fetchone()
    
    if not deck_exists:
        return jsonify({'error': 'Deck not found'}), 404
    
    # Fetch cards in the deck
    query = f'SELECT * FROM {deck_id}'
    cards = cursor.execute(query).fetchall()
    
    conn.close()
    
    return jsonify([dict(card) for card in cards])

# create a new deck
@app.route('/newdeck', methods=['POST'])
def create_deck():
    data = request.json
    deck_name = data.get('name')
    if not deck_name:
        return jsonify({'error': 'Deck name is required'}), 400
    
    sanitized_deck_name = ''.join(c for c in deck_name if c.isalnum() or c == '_')

    if not sanitized_deck_name:
        return jsonify({'error': 'Invalid deck name'}), 400

    query = f'''
    CREATE TABLE IF NOT EXISTS {sanitized_deck_name} (
        identifier TEXT, 
        set_id INTEGER, 
        number INTEGER, 
        category_id INTEGER, 
        hit_points INTEGER, 
        type1_id INTEGER, 
        type2_id INTEGER, 
        attacks TEXT, 
        weakness1_id INTEGER, 
        weakness1_amount INTEGER, 
        weakness2_id INTEGER, 
        weakness2_amount INTEGER, 
        resistance1_id INTEGER, 
        resistance1_amount INTEGER, 
        resistance2_id INTEGER, 
        resistance2_amount INTEGER, 
        retreat_cost INTEGER, 
        rarity_id INTEGER, 
        criterias1 INTEGER, 
        criterias2 INTEGER, 
        criterias3 INTEGER, 
        criterias4 INTEGER, 
        criterias5 INTEGER, 
        criterias6 INTEGER, 
        variable_damage1 INTEGER, 
        variable_damage2 INTEGER, 
        variable_damage3 INTEGER, 
        search_retrieve1 INTEGER, 
        search_retrieve2 INTEGER, 
        owner_id INTEGER, 
        primal_trait INTEGER, 
        reprint_set_id INTEGER, 
        reprint_number INTEGER, 
        text_change INTEGER, 
        full_art INTEGER
    )
    '''
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    # cursor.execute('INSERT INTO decks (name) VALUES (?)', (deck_name,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Deck created successfully'}), 201

# select card to put into deck
@app.route('/card/insert/<string:deck_id>', methods=['POST'])
def add_card_to_deck(deck_id):
    data = request.json
    card_id = data.get('card_id')
    if not card_id:
        return jsonify({'error': 'Card ID is required'}), 400
    print(card_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if deck exists
    query = f'SELECT * FROM {deck_id}'
    print("this is my query", query)
    deck = cursor.execute(query)
    if not deck:
        return jsonify({'error': 'Deck not found'}), 404
    
    # Check if card exists
    card = cursor.execute('SELECT * FROM cards WHERE identifier = ?', (card_id,)).fetchone()
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    # Add card to deck
    query = f'INSERT INTO {deck_id} VALUES ({", ".join(["?"] * 35)})'
    cursor.execute(query, tuple(card))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Card added to deck successfully'}), 201



# remove card from deck 
@app.route('/card/remove/<string:deck_id>', methods=['DELETE'])
def remove_card_from_deck(deck_id):
    data = request.json
    card_id = data.get('card_id')
    if not deck_id or not card_id:
        return jsonify({'error': 'Deck ID and Card ID are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if deck exists
    query = f'SELECT * FROM {deck_id}'
    deck = cursor.execute(query).fetchone()
    if not deck:
        return jsonify({'error': 'Deck not found'}), 404
    
    # Check if card exists in the deck
    query = f'SELECT * FROM {deck_id} WHERE identifier = ?'
    deck_card = cursor.execute(query, (card_id,)).fetchone()
    if not deck_card:
        return jsonify({'error': 'Card not found in the specified deck'}), 404
    
    # Remove card from deck
    query = f'DELETE FROM {deck_id} WHERE identifier = ?'
    cursor.execute(query, (card_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Card removed from deck successfully'}), 200

init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)