## Proposal – ideas for team project
Team #3 – members: Alex Feng, Jiarui Fu, Julie Ha, Mariana Gomes, Siddarth, Zeyu Gu.

In this document, you'll find the two initial ideas that our team came up with.

### Idea One – Media Roulette
This service would help the user find something to listen to or watch. Here's how it would work. The user would be prompted with two options for media – music or TV. 
  1. If they choose to listen to music, they'll be prompted with a list of tasks (i.e. What are you going to do? Options: Cook, Drive, Clean, etc). This will then generate a playlist that fits the task's mood.
  2. If they choose to watch media, they'll be prompted with a list of genres/categories (i.e. Comedy, Drama, etc). Once they select a category a random TV show or movie will be generated. The user can then be prompted with options "Already watched, refresh" and "Let's watch it!". This would only work with Netflix.
  
With the above options, we would use a DB to store and cache the result of the user's interaction with the service (i.e. the playlist and the movie/TV show watched). The APIs used here would be for Netflix and Spotify.


### Idea Two – Spirit Music
This service would generate a playlist/radio based on the weather in the user's location. Here's how it would work:
  - Takes user's information and stores it in database – location, login info, etc.
  - It uses third party OAuth to log in to guarantee a unique experience for each user.
  - After logging in, it either asks user for their zip code, or gets their location automatically. It then shows a radio or playlist from spotify (or apple music) with that vibe. If it's raining, we'll grab a "Rainy Day" playlist/radio and redirect the user to the app.
  - The APIs used here would be to get the weather, and the next to grab music from spotify.

The idea behind this service would be to lighten the user's mood, especially during the pandemic.
