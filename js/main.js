
'use strict';



const cartButton = document.querySelector( "#cart-button" );
const modal = document.querySelector( ".modal" );
const close = document.querySelector( ".close" );

const buttonAuth = document.querySelector( '.button-auth' );
const modalAuth = document.querySelector( '.modal-auth' );
const closeAuth = document.querySelector( '.close-auth' );
const logInForm = document.querySelector( '#logInForm' );
const logInInput = document.querySelector( '#login' );
const userName = document.querySelector( '.user-name' );
const buttonOut = document.querySelector( '.button-out' );
const cardsRestaurants = document.querySelector( '.cards-restaurants' );
const containerPromo = document.querySelector( '.container-promo' );
const restaurants = document.querySelector( '.restaurants' );
const menu = document.querySelector( '.menu' );
const logo = document.querySelector( '.logo' );
const cardsMenu = document.querySelector( '.cards-menu' );


const restaurantTitle = document.querySelector( '.restaurant-title' );
const restaurantRating = document.querySelector( '.rating' );
const restaurantPrice = document.querySelector( '.price' );
const restaurantCategory = document.querySelector( '.category' );
const inputSearch = document.querySelector( '.input-search' );
const modalBody = document.querySelector( '.modal-body' );
const modalPrice = document.querySelector( '.modal-pricetag' );
const buttonClearCart = document.querySelector( '.clear-cart' );





// let login = localStorage.getItem( 'deliveryLogin' );

// const cart = [];


let login = localStorage.getItem( 'deliveryLogin' );

const cart = JSON.parse( localStorage.getItem( `deliveryLogin_${login}` ) ) || [];

function saveCart() {
  localStorage.setItem( `deliveryLogin_${login}`, JSON.stringify( cart ) );
}

function downloadCart() {
  if ( localStorage.getItem( `deliveryLogin_${login}` ) ) {
    const data = JSON.parse( localStorage.getItem( `deliveryLogin_${login}` ) );
    cart.push( ...data );
  }
}

// getAPI
const getData = async function ( url ) {

  const response = await fetch( url );

  if ( !response.ok ) {
    throw new Error( `Ошибка по адресу ${url}, статус ошибки ${response.status}` )
  }
  return await response.json();


  // https://stackoverflow.com/questions/44278371/fetch-api-cannot-load-file-android-asset-www-xx-xxx-json-url-scheme-file-i
}




function validName( str ) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
  return regName.test( str );
};

const toggleModal = function () {
  modal.classList.toggle( "is-open" );
};

const toggleModalAuth = function () {
  modalAuth.classList.toggle( 'is-open' );
  logInInput.style.borderColor = null;
  if ( modalAuth.classList.contains( 'is-open' ) ) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function returnMain() {
  containerPromo.classList.remove( 'hide' );
  // swiper.init();
  restaurants.classList.remove( 'hide' );
  menu.classList.add( 'hide' );
}

function authorised() {
  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem( 'deliveryLogin' );
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener( 'click', logOut );
    checkAuth();
    returnMain();
  }


  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener( 'click', logOut );
}
function notAuthorised() {
  // console.log('notauthorised');

  function logIn( event ) {
    event.preventDefault();
    if ( validName( logInInput.value ) ) {
      login = logInInput.value;
      localStorage.setItem( 'deliveryLogin', login );
      toggleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener( 'click', toggleModalAuth );
      closeAuth.removeEventListener( 'click', toggleModalAuth );
      logInForm.removeEventListener( 'submit', logIn );
      logInForm.reset();
      checkAuth();
    } else {
      logInInput.style.borderColor = 'red';
      logInInput.value = '';
    }
  }

  buttonAuth.addEventListener( 'click', toggleModalAuth );
  closeAuth.addEventListener( 'click', toggleModalAuth );
  logInForm.addEventListener( 'submit', logIn );
  modalAuth.addEventListener( 'click', function ( event ) {
    if ( event.target.classList.contains( 'is-open' ) ) {
      toggleModalAuth();
    }
  } )


}

function checkAuth() {
  if ( login ) {
    authorised();
  } else {
    notAuthorised();
  }
}

function createCardRestaurant( {
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
} ) {

  // console.log(restaurant);



  const cardRestaurant = document.createElement( 'a' );
  cardRestaurant.className = ( 'card card-restaurant' );
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };


  const card = ` 
      <img src="${image}" alt="image" class="card-img">
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery}</span>
        </div>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">From ${price} $</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
  `;
  cardRestaurant.insertAdjacentHTML( 'beforeend', card );
  cardsRestaurants.insertAdjacentElement( 'beforeend', cardRestaurant );
}

function createCardGood( { description, image, name, price, id } ) {

  const card = document.createElement( 'div' );
  card.className = 'card';
  card.insertAdjacentHTML( 'beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">Add to cart</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} $</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement( 'beforeend', card );
}

function openGoods( event ) {
  const target = event.target;



  if ( login ) {
    const restaurant = target.closest( '.card-restaurant' );
    if ( restaurant ) {
      // console.log(restaurant.dataset.products);
      cardsMenu.textContent = '';

      containerPromo.classList.add( 'hide' );
      // swiper.destroy( false );
      restaurants.classList.add( 'hide' );
      menu.classList.remove( 'hide' );

      const { kitchen, name, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = price;
      restaurantCategory.textContent = kitchen;
      // console.dir(restaurant);
      getData( `./db/${restaurant.products}` ).then( function ( data ) {

        data.forEach( createCardGood );
      } );

    }

  } else {
    toggleModalAuth();
  }

}

function addToCard( event ) {
  const target = event.target;
  const buttonAddToCart = target.closest( '.button-add-cart' );

  if ( buttonAddToCart ) {
    const card = target.closest( '.card' );
    const title = card.querySelector( '.card-title-reg' ).textContent;
    const cost = card.querySelector( '.card-price' ).textContent;
    const id = buttonAddToCart.id;

    const food = cart.find( function ( item ) {
      return item.id === id;
    } )

    if ( food ) {
      food.count += 1;
    } else {
      cart.push( { id, title, cost, count: 1 } );
    }
    saveCart();
  }
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach( function ( { id, title, cost, count } ) {
    const itemCart = `
    <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
    `;
    modalBody.insertAdjacentHTML( 'afterbegin', itemCart );
  } );

  const totalPrice = cart.reduce( function ( result, item ) {
    return result + ( parseFloat( item.cost ) ) * item.count;
  }, 0 );

  modalPrice.textContent = totalPrice + ' $';

  saveCart();
}

function changeCount( event ) {
  const target = event.target;

  if ( target.classList.contains( 'counter-button' ) ) {
    const food = cart.find( function ( item ) {
      return item.id === target.dataset.id;
    } );
    if ( target.classList.contains( 'counter-minus' ) ) {
      food.count--;
      if ( food.count === 0 ) {
        cart.splice( cart.indexOf( food ), 1 );
      }
    }


    if ( target.classList.contains( 'counter-plus' ) ) food.count++;

    renderCart();
  };

}

function init() {
  getData( './db/partners.json' ).then( function ( data ) {

    // console.log(data);
    data.forEach( createCardRestaurant );
  } );

  cartButton.addEventListener( 'click', function () {
    renderCart();
    toggleModal();
  } );

  buttonClearCart.addEventListener( 'click', function () {
    cart.length = 0;
    renderCart();
    toggleModal();
  } )

  modalBody.addEventListener( 'click', changeCount );

  cardsMenu.addEventListener( 'click', addToCard );

  close.addEventListener( 'click', toggleModal );

  cardsRestaurants.addEventListener( 'click', openGoods );
  logo.addEventListener( 'click', function () {
    containerPromo.classList.remove( 'hide' );
    // swiper.init();
    restaurants.classList.remove( 'hide' );
    menu.classList.add( 'hide' );
  } );

  checkAuth();

  inputSearch.addEventListener( 'keypress', function ( event ) {
    if ( event.charCode === 13 ) {
      const value = event.target.value.trim();

      if ( !value ) {
        event.target.style.backgroundColor = 'red';
        event.target.value = '';
        setTimeout( function () {
          event.target.style.backgroundColor = '';
        }, 1500 );
        return;
      }

      getData( './db/partners.json' )
        .then( function ( data ) {
          return data.map( function ( partner ) {
            return partner.products;
          } );
        } )
        .then( function ( linksProduct ) {
          cardsMenu.textContent = '';

          linksProduct.forEach( function ( link ) {
            getData( `./db/${link}` )
              .then( function ( data ) {

                const resultSearch = data.filter( function ( item ) {
                  const name = item.name.toLowerCase();
                  return name.includes( value.toLowerCase() );
                } )

                containerPromo.classList.add( 'hide' );
                // swiper.destroy( false );
                restaurants.classList.add( 'hide' );
                menu.classList.remove( 'hide' );

                restaurantTitle.textContent = 'Результат поиска';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = '';
                restaurantCategory.textContent = 'Разная кухня';

                resultSearch.forEach( createCardGood );

              } )
          } )
        } )
    }
  } )

  //Slider

  new Swiper( '.swiper-container', {
    slidePreview: 1,
    loop: true,
    autoplay: true,
    effect: 'flip',
  } );


}
init();
