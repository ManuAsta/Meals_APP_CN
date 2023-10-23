


function initializeApp(){

        /*we would need search bar, search results to show the results */
        const searchBar=document.getElementById('meals-search');
        const searchResults=document.getElementById('search-results');
        /**one meal container to show info about one meal */
        const oneMealContainer=document.getElementById('one-meal');
        /**for the placeholder of search results */
        const searchResultsPlaceholder=document.getElementById('loading-results');
        /**for placeholder of one meal */
        const oneMealPlaceholder=document.getElementById('one-meal-placeholder');
        /**For displaying many meals */
        const manyMealsContainer=document.getElementById('many-meals');
        /**for displaying using the search button */
        const searchIcon=document.getElementById('search-icon');
        //favorite button for displaying favorites
        const favButton=document.getElementById('fav-button');

        //for searching and making sure nothing is displayed when it is empty
        //too keep track of selected index
        let selectedItemIndex=-1;

        /*Using mealsArray to store temporarily the fetched meals data*/
        let mealsArray=[];


        //for favorites, we will maintain a hashMap and store it in our local storage
        //key will be the id and the value will be the meal object, with favorite attribute as well
        //first check if the localStorage has it
        let favoriteMap=new Map();
        const storedFavMealsMap=localStorage.getItem("favoriteMap");
        if(storedFavMealsMap){
            favoriteMap=new Map(JSON.parse(storedFavMealsMap));
        }
        

        


        //functions for clearing fields
        let clearFunctions={
            //for clearing Search Results in Search Bar
            clearSearchResults:()=>{
                //if there is noinput value
                if(!searchBar.value){
                    displaySearchResults(null);
                }
    
                //this is to handle the case if the user backspaces continuously
                //this would cause delay between the key press and the event being processed
                //so we add an asynchronous task to make sure that no serach results are displayed when the input filed is empty
                setTimeout(()=>{
                    if(!searchBar.value){
                        displaySearchResults(null);
                    }
                },900);
            },

            //for clearning the input field of search
            clearInputField:()=>{
                searchBar.value="";
            },
            //for clearing the display of one meal
            clearOneMeal:()=>{
                oneMealContainer.innerHTML="";
            },

            //for clearning many meals
            clearManyMeals:()=>{
                manyMealsContainer.innerHTML="";
            }
        }

        


        /**functions related to displaying the meals */
        let displayMealsFunctions={
            //for displaying a single meal
             displaySingleMeal:(mealId)=>{
                 clearFunctions.clearInputField();
                 clearFunctions.clearManyMeals();
                 clearFunctions.clearOneMeal();
                 displaySearchResults(null);
                //  console.log(mealId,"YO YO");
                 async function getMealById(){
                     try{
                        oneMealPlaceholder.style.display="flex";
                         const url=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
                         const response= await fetch(url);
                         const data=await response.json();
                         const meal=data.meals[0];
                         oneMealPlaceholder.style.display="none";
                        //  console.log(meal);
                         if(!favoriteMap.has(mealId)){
                            meal["favorite"]=false;
                         }else{
                            meal["favorite"]=true;
                         }
                         showMeal(meal);
                     }catch(err){
                         console.log("Error fetching the meal by id",err);
                     }
                 }
                 
         
                 function showMeal(meal){
                    oneMealContainer.innerHTML=`
                    <div class="meal-info">
                        <h5><u>Main Ingredients</u></h5>
                        <ul class="list-group list-group-flush meal-ingredients">
                            <li class="list-group-item">${meal.strIngredient1}</li>
                            <li class="list-group-item">${meal.strIngredient2}</li>
                            <li class="list-group-item">${meal.strIngredient3}</li>
                            <li class="list-group-item">${meal.strIngredient4}</li>
                            <li class="list-group-item">${meal.strIngredient5}</li>
                        </ul>
                        <h5><u>Links</u></h5>
                        <div class="meal-links">
                            <a href="${meal.strYoutube}" target="_blank" class="btn btn-primary">Youtube Link</a>
                        </div>
                        <h5><u>Favorites</u></h5>
                        <div >
                        <i class="fa-solid fa-heart one-fav" style="${meal.favorite? "color:red":"color:orange"}" data-mealid="${meal.idMeal}"></i>
                        </div>
                        
                    </div>
                    <div class="card">
                        <h2 class="card-title">${meal.strMeal}</h2>
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strCategory}">
                        <div class="card-body">
                        <h5>Preparation Method</h5>
                        <p class="card-text">${meal.strInstructions}</p>
                        </div>
                    </div>
                    `
                 }
                 getMealById();
             },


             //for displaying many  meals, this takes an arrays as input
             displayManyMeals:function(meals){
                clearFunctions.clearInputField();
                clearFunctions.clearManyMeals();
                clearFunctions.clearOneMeal();
                displaySearchResults(null);
                meals.forEach((meal,index)=>{
                    //create a div 
                    const div=document.createElement('div');
                    div.classList.add('card');
                    div.innerHTML=`
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <h6 class="card-text">Category: ${meal.strCategory} <br> Tags: ${meal.strTags}</h6>
                        </div>
                     `
                    const h6=document.createElement('h6');
                    if(meal.favorite){
                        h6.innerHTML=`
                        Remove From Favorites: <i class="fa-solid fa-heart meal-fav" style="${meal.favorite? "color:red":"color:orange"}" data-mealid="${meal.idMeal}"></i>
                      `
                    }else{
                        h6.innerHTML=`
                        Add To Favorites: <i class="fa-solid fa-heart meal-fav " style="${meal.favorite? "color:red":"color:orange"}" data-mealid="${meal.idMeal}"></i>
                        `
                    }
                    div.appendChild(h6);

                    button=document.createElement('button');
                    button.classList.add('btn');
                    button.classList.add('btn-primary');
                    button.textContent="More details";
                    button.onclick=()=>{
                        this.displaySingleMeal(meal.idMeal);
                    };
                    div.append(button);
                    manyMealsContainer.appendChild(div);
              });
             },

             displayFavorites:function(){
                clearFunctions.clearInputField();
                clearFunctions.clearManyMeals();
                clearFunctions.clearOneMeal();
                displaySearchResults(null);
                if(favoriteMap.size==0){
                    console.log("hello");
                    const h1=document.createElement('h1');
                    h1.textContent="No Favorites to Show, Please add some meals to your favorites..."
                    manyMealsContainer.appendChild(h1);
                    return;
                }
                favoriteMap.forEach((meal,mealId)=>{
                     //create a div 
                     const div=document.createElement('div');
                     div.classList.add('card');
                     div.innerHTML=`
                         <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                         <div class="card-body">
                         <h5 class="card-title">${meal.strMeal}</h5>
                         <h6>Remove From Favorites: <i class="fa-solid fa-heart favorites ${meal.favorite? "red":""}" data-mealid="${meal.idMeal}"></i></h6>
                         <h6 class="card-text">Category: ${meal.strCategory} <br> Tags: ${meal.strTags}</h6>
                         </div>
                      `
                     button=document.createElement('button');
                     button.classList.add('btn');
                     button.classList.add('btn-primary');
                     button.textContent="More details";
                     button.onclick=()=>{
                         this.displaySingleMeal(meal.idMeal);
                     };
                     div.append(button);
                     manyMealsContainer.appendChild(div);
                });
             }
         }


         let toggleFunctions={
                            //function for toggling favorites
                    toggleFavoriteInSearch:(mealId,targetFav)=>{

                        //search for the mealId and add it to our favorites
                        mealsArray.forEach((meal)=>{
                            if(mealId==meal.idMeal){
                                // console.log(meal);
                                //toggle meal favorite
                                meal.favorite=!meal.favorite;
                                if(meal.favorite==true){
                                    favoriteMap.set(mealId,meal);
                                }else{
                                    //remove it from favorite
                                    favoriteMap.delete(mealId);
                                }
                                // console.log(favoriteMap);
                                //adding it to localstorage
                                // console.log(favoriteMap.entries());
                                let favMealsArray=Array.from(favoriteMap);
                                // console.log(favMealsArray);
                                let favMealsMap=JSON.stringify(favMealsArray);
                                // console.log(favMealsMap);
                                // console.log(JSON.parse(favMealsMap));
                                // let myMap=new Map(JSON.parse(favMealsMap));
                                // console.log(myMap);
                                localStorage.setItem("favoriteMap",favMealsMap);
                            }
                        });
                        displaySearchResults(mealsArray);

                    },
                    //for toggling in favorites section

                    toggleFavoriteInFavorites:(mealId,targetFav)=>{
                        // console.log(favoriteMap.get(mealId));
                        //remove it from favorites
                        favoriteMap.delete(mealId);
                        //set the favorites in localStorage again
                        let favMealsArray=Array.from(favoriteMap);
                        let favMealsMap=JSON.stringify(favMealsArray);
                        localStorage.setItem("favoriteMap",favMealsMap);
                        displayMealsFunctions.displayFavorites();
                    },
                    
                    toggleFavoriteInManyMeals:(mealId,targetFav)=>{
                        // console.log(mealsArray);
                         //search for the mealId and add it to our favorites
                         mealsArray.forEach((meal)=>{
                            if(mealId==meal.idMeal){
                                // console.log(meal);
                                //toggle meal favorite
                                meal.favorite=!meal.favorite;
                                if(meal.favorite==true){
                                    favoriteMap.set(mealId,meal);
                                }else{
                                    //remove it from favorite
                                    favoriteMap.delete(mealId);
                                }
                                // console.log(favoriteMap);
                                //adding it to localstorage
                                // console.log(favoriteMap.entries());
                                let favMealsArray=Array.from(favoriteMap);
                                // console.log(favMealsArray);
                                let favMealsMap=JSON.stringify(favMealsArray);
                                // console.log(favMealsMap);
                                // console.log(JSON.parse(favMealsMap));
                                // let myMap=new Map(JSON.parse(favMealsMap));
                                // console.log(myMap);
                                localStorage.setItem("favoriteMap",favMealsMap);
                            }
                        });
                        displayMealsFunctions.displayManyMeals(mealsArray);
                    },

                    toggleFavoriteInSingleMeal:function(mealId,FavIcon){
                        // console.log(mealsArray);
                        mealsArray.forEach((meal)=>{
                            if(mealId==meal.idMeal){
                                // console.log(meal);
                                //toggle meal favorite
                                meal.favorite=!meal.favorite;
                                if(meal.favorite==true){
                                    favoriteMap.set(mealId,meal);
                                }else{
                                    //remove it from favorite
                                    favoriteMap.delete(mealId);
                                }
                                // console.log(favoriteMap);
                                //adding it to localstorage
                                // console.log(favoriteMap.entries());
                                let favMealsArray=Array.from(favoriteMap);
                                // console.log(favMealsArray);
                                let favMealsMap=JSON.stringify(favMealsArray);
                                // console.log(favMealsMap);
                                // console.log(JSON.parse(favMealsMap));
                                // let myMap=new Map(JSON.parse(favMealsMap));
                                // console.log(myMap);
                                localStorage.setItem("favoriteMap",favMealsMap);
                            }
                        });
                        displayMealsFunctions.displaySingleMeal(mealId);
                    }
         }

        
        

        //click handler
        document.onclick=(e)=>{
            //this if for handling clicks
            //for handling clicks
            // console.log(e.target);
            //the serach icon for searching the meals
            if(e.target.className.includes('fa-searchengin')){
                if(!searchBar.value){
                    return;
                }
                if(mealsArray){
                    displayMealsFunctions.displayManyMeals(mealsArray);
                }
            };

            //for searching a particular item or meal upon clicking the search result
            if(e.target.className.includes('search-results-item-text')){
                if(mealsArray){
                    // console.log(e.target.dataset.mealid);
                    const mealId=e.target.dataset.mealid;
                    displayMealsFunctions.displaySingleMeal(mealId);
                }
            }

            //for toggling favorite
            if(e.target.className.includes('fav-search')){
                // console.log("heart clicked");
                //if there are meals being displayed only then the heart is appearing right!
                // console.log(e.target.dataset.mealid);
                const mealId=e.target.dataset.mealid;
                // console.log(mealId);
                // console.log("heart clicked");
                toggleFunctions.toggleFavoriteInSearch(mealId,e.target);
            }

            //for favorites button clicked
            if(e.target.id=="fav-button"){
                // console.log("favorite clicked");
                displayMealsFunctions.displayFavorites();
            }

            //for toggling in favoritesmeals in favorites
            if(e.target.className.includes("favorites")){
                const mealId=e.target.dataset.mealid;
                // console.log(mealId);
                toggleFunctions.toggleFavoriteInFavorites(mealId,e.target);
            }

            //for toggling in favorites in Manymeals
            if(e.target.className.includes("meal-fav")){
                // console.log("clicked");
                const mealId=e.target.dataset.mealid;
                // console.log(mealId);
                toggleFunctions.toggleFavoriteInManyMeals(mealId,e.target);
            }

            //for toggling favorites in single meal
            if(e.target.className.includes('one-fav')){
                const mealId=e.target.dataset.mealid;
                toggleFunctions.toggleFavoriteInSingleMeal(mealId,e.target);
            }
        }



       



        


       



        //staring when use focus on search, it should sugest a result
        searchBar.onfocus=()=>{
            searchBar.placeholder="Try searching BBQ...";
        };

        //function for input and changing input
        searchBar.oninput=async function(){
            //initializing
            selectedItemIndex=-1;

            const foodName=searchBar.value;
            //on input, i should search for and fetch the meals
            //for clearing the input field
            clearFunctions.clearSearchResults();
            //for fetching and displaying the search results
            findMeals(foodName);
        };


        searchBar.onkeydown=function(e){
            const results=document.querySelectorAll('.search-results-item');
        
            if(e.key=="ArrowDown" || e.key=="ArrowUp"){
                if(results.length==0){
                    return;
                }
                //else we have the search results and we can itearate over them
                if(e.key=="ArrowDown" && selectedItemIndex<results.length){
                    selectedItemIndex++;
                    updateSelectedItem(results);
                }
                if(e.key=="ArrowUp" && selectedItemIndex>0){
                    selectedItemIndex--;
                    updateSelectedItem(results);
                }
            }

            if(e.key=="Enter"){
                if(searchBar.value==""){
                    return;
                }
                if(selectedItemIndex>=0){
                    //it means user selected a meal and we need to display it
                    // console.log(selectedItemIndex);
                    mealsArray.forEach((meal,index)=>{
                        if(selectedItemIndex==index){
                            displayMealsFunctions.displaySingleMeal(meal.idMeal);
                            return;
                        }
                    });
                }else{
                     // console.log(mealsArray);
                    displayMealsFunctions.displayManyMeals(mealsArray);
                }
               
            }
        }

        //function for fetching the meals and displaying
        async function findMeals(foodName){
            if(foodName.length==1 && foodName!=" "){
                mealsArray=[];
                try{
                    searchResults.innerHTML="";
                    //here before fetching it should show the placeholder
                    searchResultsPlaceholder.style.display="block";
                    // fetch the food content based on the searched first letter
                    //here i wanna show all the food available with the letter
                    const url=`https://www.themealdb.com/api/json/v1/1/search.php?f=${foodName}`;
                    const response= await fetch(url);
                    const data=await response.json();
                    mealsArray=data.meals;
                }catch(err){
                    console.log("Error fetching",err);
                }
                //after getting the search results, is shouldn't show
                searchResultsPlaceholder.style.display="none";
               
                displaySearchResults(mealsArray);
            }
            if(foodName.length>1){
                mealsArray=[];
                try{
                    searchResults.innerHTML="";
                    searchResultsPlaceholder.style.display="block";
                    //fetch the food content based on the searched letter
                    const url=`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
                    const response= await fetch(url);
                    const data=await response.json();
                    mealsArray=data.meals;
                }catch(err){
                    console.log(err);
                }
                // console.log(mealsArray);
                if(mealsArray){
                    const meals=mealsArray.filter(meal=>{
                        return meal.strMeal.toLowerCase().includes(foodName.toLowerCase());
                    });
                    mealsArray=meals;
                    //after getting the search results, is shouldn't show
                    searchResultsPlaceholder.style.display="none";
                    displaySearchResults(meals);
                }else{
                    //after getting the search results, is shouldn't show
                    searchResultsPlaceholder.style.display="none";
                    //incase no meal exists with food name, display mealsn not found
                    displaySearchResults(null);
                }
            }
        }




        /**Function for displaying the search results just like google */
        function displaySearchResults(meals){
            searchResults.innerHTML="";
            if(meals){   
                meals.forEach((meal,index)=>{
                    //create an li elemet and append it

                    //if it is there in our favorite map then
                    //add the favorite property as true
                    if(favoriteMap.has(meal.idMeal)){
                        meal["favorite"]=true;
                    }

                    //adding favorite property 
                    if(!meal["favorite"]) {
                        meal["favorite"]=false;
                    }
                    const li=document.createElement('li');
                    li.classList.add('search-results-item');
                    li.classList.add('hover-pointer');
                    li.innerHTML=`
                    <div class="search-results-item-text" data-mealid="${meal.idMeal}">${meal.strMeal}</div>
                        <div class="favorite-button"><i class="fa-solid fa-heart fav-search  ${meal.favorite? "red":""}" data-mealid="${meal.idMeal}"></i></div>
                    `
                    li.addEventListener('mouseover',()=>{
                        selectedItemIndex=index;
                        const results=document.querySelectorAll('.search-results-item');
                        updateSelectedItem(results);
                    });
                    searchResults.appendChild(li);
                });
                // console.log(mealsArray);
            }else{
                if(searchBar.value){
                    const h2=document.createElement('h3');
                    h2.textContent="Meal Not Found";
                    searchResults.append(h2);
                    return;
                }
                searchResults.innerHTML="";
            }
        }

         //for highlithing the selected search result upon using arrow key
         function updateSelectedItem(results){
            // console.log(selectedItemIndex);
            results.forEach((li,index)=>{
                if(index==selectedItemIndex){
                    li.classList.add("selected");
                }else {
                    li.classList.remove('selected');
                }
            });
        } 
        
}

initializeApp();


