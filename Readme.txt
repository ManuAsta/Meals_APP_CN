Functionalities of the page

1) Show suggestions just like google searching suggestions
2) Show placeholders while the results are being fetchid
3) Three main pages, 
    a) To show one meal (when the user clicks on a selection on a search result)
       (The user can also use keyboard navigation to select a search result and press Enter)
    b) To show many meals (when the user clicks the search icon directly)
        (The user can also press Enter just by entering a name and clicking Enter)
    c) To view Favorites page (when clicked on the favoirtes button)
4) For the favorites,
    a) Use local storage to save the faovorite meals of the user
    b) The user can add or remove the favorites from
        I) Either by clicking on the favorite icon in the search result
        II) By clicking on the favorite icon in the many meals page
        III) By clicking on the favorite icon in the single meal page
        IV) The user can remove the meal  from the favorites list by clicking on the remove favorite
    c) Red favorite(heart) icon indicates that the meal is added to favorite, Orange/No color indicates that meal is not favorite
5) Mobile Friendly


----------------------------------------------------------------------------------------------------------------------------------------
Process followed

//for the search and navigation section
1) Make the home page with search bar 
2) show the search results by fetching the meals from the api and show them like google suggestions
3) Style the search bar and the results container
4) Meanwhile the meals are being fetched, show placeholder in the search section for better user experience
5) Use Bootstrap placeholder for displaying it,toggle display to block and none, before and after fetching the meals
6) Add keyboard down arrow navigation to the search results by using a selected index, that starts with -1
7) We update the selected result search by incrementing the selectedIndex and by adding and removign class "selected" dynamically, so that the selected search is highlighted

//handling clicks
7) For handling clicks, document.onclick and select a particular element by it's className or id

//storage
8) When searched, we store the search results that are fetched, in a mealsArray[]
9) This mealsArray would last until there is a new search
10) So, we can use this meals array to display many meals in the many meals page
11) For favorites, a favoriteMap is maintained, with the keys being the meal ID and the value being the meal Object
12) This favoriteMap is loaded when the browser is reloaded, and it is stored in the local storage 
13) this favoriteMap searches the local storage first when the browser loads , if not a new map
14) This favoriteMap can be used to display the favorites when clicked on the "view favorites" button


//for displaying single meal
15) The user can either select using a click or navigate using the keyboard arrows to select a particular meal from the search and enter
16) when the user clicks or presses enter at a particular meal search, the meal id is sent to the SingleMealDisplay Function
17) The SingleMealDisplay function will use the id to fetch that meal and display it
18) We can also use the mealsArray instead of fetching it again, but it would be good to show and practice the placeholder for single meal page
19) To style the single meal page, Bootstrap card is used


//for displaying many meals pages
20) When the user enters an inpuut in the search but doesn't select a particular search, we show all the possible meals matching the search
21) For example the user just enters "chicken", so we show all the meals with chicken in their name
22) The user can either press the enter directly or click the search icon
23) We already have the search results in our mealsArray, so we just iterate it and display
24) To style the many meals page, flexbox is used with Bootstrap cards as the boxes
25) The boxes(meals) in many meals page, will have the links to their single page
26) When clicked on this link, the id is passed on the displaySingleMeals page
27) These boxes(meals) also have option to add and remove from favorites

//for favorites
28) For marking a meal as favorite or not, we add a property for every meal, while fetching it
    meal["favorites"]=false
29) this can be toggled When
    a)user clicks on heart icon in search results
     ->When the user clicks, the heart icon id is passed to toggleFavoriteInSearch function
     ->This will toggle the meal.favorite in mealsArray
     ->Then update the favoriteMap, either add or remove it from the map
     ->Then display the search results again, with the favorite as "red heart"
    b)user clicks on the favorite button in either the Single Meal Page or the Many Meals Page
     ->When the user clicks, the mealID is passed to their respective toggleFunctions
     ->We have the mealsArray, so we search for that meal and toggle it 
     ->Update the favoriteMap everytime this Favorite icon is clicked
     ->Then display the updated results in their respective pages, with the "heart" icon being red or Orange
    

------------------------------------------------------------------------------------------------------------------------------

Library used for styling is 

1) Bootstrap
2) Font Awesome(for icons)


------------------------------------------------------------------------------------------------------------------------------------

Extra features added

1) When we press the ArrowDown from search result, we can navigate that way and hit enter at a particular search just like youtube and google
2) while searching, there is a placeholder indicating the results are being fetched, for a better user experience
3) Animation for the main-meal image/theme of the page
4) Displaying many meals and adding favorite button to all of them
5) Single letter search (The user can just enter a letter and see all the dishes starting on that letter)
6) Mobile friendly
