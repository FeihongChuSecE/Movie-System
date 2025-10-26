# Movie-System
Brief overview: Users can manage all the movies(name, introduce, rate, views) they watched, add new movies, delete movies, or update movies. This is a system to record your personal interest movie. Maybe it can suggest movies you would like.  
# phase 2
As a single user, movie system could login "/users/id" with name/ email/ phone/ username etc. BUT user connot delete the user information.
Movies have home page "/movies",  fetch all the movies; 
detail page "/movies/id", fetch a single movie by id;
user page "/movies/id", fetch the users interested movies.
# phase 3
use mongoDB and mongoDBCompass to create pages
movies:
GET "/movies", get all the movies;
GET "/movies?name=<movieName>", Check movie exsit. If yes, return the moview details.if not, create a new movie;
DELETE "/movies/:id", delete the movie by id(_id:68fc3bd056aaac9b06b22262);
POST "/movies", add a new movie;
PUT "/movies/:id", update a movie by id(_id).
users:
POST "/users", add a new user;
GET "/users/:id", get a specific user by id(_id).

