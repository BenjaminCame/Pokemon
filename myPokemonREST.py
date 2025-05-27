import requests

myPokemon = requests.get("https://pokemondb.net/pokedex/bulbasaur/total")

print(myPokemon.Response)