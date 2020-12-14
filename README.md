# 411 Team 3
A repository to hold our team's assignments
Participants: Alex Feng, Jiarui Fu, Julie Ha, Mariana Gomes, Siddarth Gumireddy, Zeyu Gu.

# Link to video demo: https://youtu.be/1MriEE_qa4Y

### Overview of app and tech-stack used
This application allows a user to create an account and generate a spotify playlist based on the weather in the user's location. There are two ways to do this, either the user decides to generate a playlist based on the city stored in their profile, or wherever they are in the globe. Perhaps the user is in New York but their account has Boston stored, they could generate a playlist for either location's weather. Once a playlist is generated it is automatically stored in the database under the user's account, and all playlists generated for the user is displayed under a collapsible tab on the home page.

We used `Node Express` along with `Pug` templater as our RESTful api. For the database portion we went with `mongodb`, and to prevent loose manipulation of the data stored into the database (i.e. to prevent that some users have some data fields and others don't) we've added constraints on the input fields when signing up, so the user is obligated to fill in all input fields to have a precise/even database collection across all users. The APIs we went with for this application were Spotify's API and a Weather API – we also instantiated a Geolocation API which grabs the user's GPS coordinates. And for OAuth we went with Twitter.

### Who did what?
All members on the team played a crucial role in all portions of the creation of this project – from project decisions to project execution. We wanted to highlight who did what here because some of us worked together on pieces of code, so not everyone's face is on the git commit history – here goes:
  - Alex: Played a major role in styling, he took the reigns on styling the welcome page, sign in page and sign up page by adding imagery and making the forms password safe.
  - Jiarui: When deciding what direction to steer this project, he was instrumental in bringing clarity on the specifications of the project which allowed us to always trek the right path. He also created all of the logic that takes the current weather and decides what kind of music a playlist should contain.
  - Julie: Played a crucial role in product work, when we were stuck on what to choose she would be the first to give her opinion and we were quick to follow in agreeance with her. She worked alongside Alex with the styling and helped bring to life the beautiful styling of the welcome and sign in/up pages.
  - Mariana: Brought lots of ideas to the table and left them up for debate, which helped stir some ideas and conversation during product work. In creating the app, she wired up the first API (weather), she wired up the database to the application, and also tweaked the styling on the home page to make the list of spotify data look good.
  - Siddarth: Played a fundamental role in our team, he was the first to create a slack channel and always made sure we were on top of the workload, making sure that we would meet with plenty of time to discuss and debug as needed. He worked alongside Zeyu to wire up the Spotify API to the application. 
  - Zeyu: Was instrumental when it came to coding, as soon as coding came into play he was hands on deck and made sure to help anyone that was stuck or needed help. As mentioned above, he worked alongside Siddarth to wire up the Spotify API to the app. He also wired up the OAuth portion of the code to the application!

Overall, we were a great team and worked great together. We all played a fundamental role in creating every bit of this application.
