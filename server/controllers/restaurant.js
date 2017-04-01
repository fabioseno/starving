/*global module*/
var restaurants = [
    {
        id: 1,
        name: 'Outback',
        cuisine: 'Steakhouse',
        price: '$$$$',
        image: 'https://t1.rg.ltmcdn.com/pt/images/1/0/8/img_blooming_onion_do_outback_2801_600.jpg'
    },
    {
        id: 2,
        name: 'Churrascaria Princesa',
        cuisine: 'Barbecue',
        price: '$$$',
        image: 'http://prudentopolisonline.com.br/wp-content/uploads/2015/10/churrascos.jpg'
    },
    {
        id: 3,
        name: 'Quarentão',
        cuisine: 'All you can eat',
        price: '$$',
        image: 'http://revistasaboresdosul.com.br/wp-content/uploads/2015/11/melhor-bufe-livre-panorama-gastronomico-640x385.jpg'
    },
    {
        id: 4,
        name: 'Lancheria do Parque',
        cuisine: 'All you can eat',
        price: '$',
        image: 'https://media-cdn.tripadvisor.com/media/photo-s/08/3e/db/24/ala-minuta.jpg'
    },
    {
        id: 5,
        name: 'Silva',
        cuisine: 'Rice and beans',
        price: '$',
        image: 'http://zh.rbsdirect.com.br/imagesrc/16547965.jpg?w=640'
    },
    {
        id: 6,
        name: 'Usina das Massas',
        cuisine: 'Italian Food',
        price: '$$',
        image: 'https://media-cdn.tripadvisor.com/media/photo-s/09/72/18/f2/usina-de-massas.jpg'
    },
    {
        id: 7,
        name: 'Japesca',
        cuisine: 'Japanese Food',
        price: '$$',
        image: 'https://imagesapt.apontador-assets.com/fit-in/640x480/d8ac27457d3146e99b50ca39d83cb828/temakeria-japesca.jpg'
    },
    {
        id: 8,
        name: 'Subway',
        cuisine: 'Sandwich',
        price: '$$',
        image: 'https://img.grouponcdn.com/deal/fCtzkA8eq1Rgc1ruzKm7/u4-1440x864/v1/c700x420.jpg'
    }
],
    
    getRestaurant = function (id) {
        var restaurant, i;
        
        for (i = 0; i < restaurants.length; i += 1) {
            if (restaurants[i].id === id) {
                restaurant = restaurants[i];
                break;
            }
        }
        
        return restaurant;
    };

module.exports = {
    restaurants: restaurants,
    getRestaurant: getRestaurant
};