// IMAGE IMPORTS
import blackGram from "./blackGram.jpeg";
import chickpea from "./Chickpea.jpeg";
import greenGram from "./GreenGram.jpeg";
import lentil from "./Lentil.jpeg";
import pigeonPea from "./pigeonPea.jpeg";

import amaranthleaves from './amaranthleaves.jpg';
import arbi from './arbi.jpg';
import asparagus from './asparagus.jpg';
import barley from './Barley.jpeg';
import beetgreens from './beetgreens.jpg';
import beetroots from './beetroots.jpg';
import bhindi from './bhindi.jpg';
import bokchoy from './bokchoy.jpg';
import bottlegourd from './bottlegourd.webp';
import bambooshoots from './bambooshoots.avif';
import brinjal from './Brinjal.jpeg';
import broadbeans from './broadbeans.jpg';
import broccoli from './broccoli.jpg';
import brusselssprouts from './brusselssprouts.jpg';
import cabbage from './Cabbage.jpeg';
import capsicum from './capsicum.jpg';
import carrot from './carrot.jpg';
import castorseeds from './castorseeds.webp';
import cauliflower from './cauliflower.jpg';
import celery from './celery.jpg';
import chilipepper from './chilipepper.jpeg';
import coconut from './cocnut.jpg';
import cocoa from './cocoa.jpg';
import coffee from './coffee.jpg';
import colocasialeaves from './colocasialeaves.jpg';
import corianderleaves from './corianderleaves.jpeg';
import cotton from './cotton.jpg';
import cucumber from './cucumber.jpg';
import curryleaves from './curryleaves.jpg';
import drumstick from './drumstick.jpeg';
import elephantfootyam from './elephantfootyam.webp';
import fennel from './fennel.jpg';
import fingermillet from './fingermillet.webp';
import fengrukleaves from './fengrukleaves.png';
import frenchbeans from './frenchbeans.jpg';
import garlic from './Garlic.jpg';
import greenpeas from './greenpeas.jpg';
import jackfruit from './jackfruit.jpg';
import jerusalemarthichoke from './jerusalemarthichoke.jpg';
import jute from './jute.jpg';
import kale from './kale.jpg';
import karela from './karela.webp';
import kohlrabi from './kohlrabi.jpg';
import leek from './leek.jpg';
import lettuce from './lettuce.jpg';
import linseeds from './linseeds.jpg';
import maize from './maize.jpeg';
import millet from './millet.webp';
import mustard from './mustard.webp';
import mustardgreens from './mustardgreens.jpg';
import onion from './Onion.jpeg';
import peanut from './peanut.jpg';
import potato from './Potato.jpeg';
import pumpkin from './pumpkin.jpg';
import raddish from './raddish.jpg';
import rice from './rice.jpg';
import rubberplant from './rubberplant.webp';
import safflowerseeds from './safflowerseeds.jpg';
import sesameseeds from './sesameseeds.webp';
import shallot from './shallot.jpg';
import snakegourd from './snakegourd.webp';
import snowpeas from './snowpeas.jpg';
import sorghum from './sorghum.webp';
import soyabean from './soyabean.jpg';
import soyabeanplant from './soyabeanplant.jpg';
import spinach from './spinach.jpg';
import spongegourd from './spongegourd.webp';
import squash from './squash.jpg';
import sugarcane from './sugarcane.jpg';
import sunflowerseeds from './sunflowerseeds.jpg';
import sweetpotato from './sweetpotato.jpg';
import tapioca from './tapioca.jpg';
import tealeaves from './tealeaves.jpg';
import tobacco from './tobacco.jpg';
import tomato from './Tomato.jpeg';
import turai from './turai.webp';
import turnip from './turnip.jpg';
import wheat from './wheat.jpeg';
import yam from './yam.jpg';
import zucchini from './zucchini.jpg';

// FRUIT IMAGES
import apple from './apple.jpg';
import avocado from './avocado.jpg';
import banana from './banana.jpg';
import blueberry from './blueberry.jpg';
import dragonfruit from './Dragonfruit.jpg';
import fig from './fig.jpg';
import grapes from './grapes.jpg';
import guava from './guava.jpg';
import kiwi from './kiwi.jpg';
import lemon from './lemon.jpg';
import lichi from './lichi.jpg';
import mango from './Mango.jpg';
import mangosteen from './Mangosteen.jpg';
import mosambi from './mosambi.jpg';
import oranges from './oranges.jpg';
import papaya from './papaya.jpg';
import pineapple from './pineaple.jpg';
import pomegranate from './pomegranate.jpg';
import rambutan from './rambutan.jpg';
import redberry from './redberry.jpg';
import sapodilla from './sapdila_chikoo.jpg';
import starfruit from './starfruit.jpg';
import tangerine from './tangerine.jpg';
import watermelon from './watermelon.jpg';

// CROPS
export const crops = [
  { _id: 1, name: "Wheat", image: wheat, category: "Careal Crops", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 20 },
  { _id: 2, name: "Rice", image: rice, category: "Careal Crops", soilType: "Clay", season: "Kharif", waterRequirement: "High", price: 25 },
  { _id: 3, name: "Maize", image: maize, category: "Careal Crops", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Moderate", price: 30 },
  { _id: 4, name: "Barley", image: barley, category: "Careal Crops", soilType: "Loamy", season: "Rabi", waterRequirement: "Low", price: 40 },
  { _id: 5, name: "Sorghum (Jowar)", image: sorghum, category: "Careal Crops", soilType: "Alluvial", season: "Kharif", waterRequirement: "Low", price: 30 },
  { _id: 6, name: "Pearl Millet (Bajra)", image: millet, category: "Careal Crops", soilType: "Black Soil", season: "Kharif", waterRequirement: "Low", price: 25 },
  { _id: 7, name: "Finger Millet (Ragi)", image: fingermillet, category: "Careal Crops", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Moderate", price: 32 },

  { _id: 8, name: "Sugarcane", image: sugarcane, category: "Cash Crops", soilType: "Alluvial", season: "Annual", waterRequirement: "High", price: 35 },
  { _id: 9, name: "Cotton", image: cotton, category: "Cash Crops", soilType: "Black Soil", season: "Kharif", waterRequirement: "Moderate", price: 60 },
  { _id: 10, name: "Jute", image: jute, category: "Cash Crops", soilType: "Alluvial", season: "Kharif", waterRequirement: "High", price: 35 },
  { _id: 11, name: "Tobacco", image: tobacco, category: "Cash Crops", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Moderate", price: 150 },

  { _id: 12, name: "Groundnut (Peanut)", image: peanut, category: "Oil Seeds", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Moderate", price: 70 },
  { _id: 13, name: "Mustard", image: mustard, category: "Oil Seeds", soilType: "Loamy", season: "Rabi", waterRequirement: "Low", price: 65 },
  { _id: 14, name: "Soybean", image: soyabeanplant, category: "Oil Seeds", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 40 },
  { _id: 15, name: "Sunflower", image: sunflowerseeds, category: "Oil Seeds", soilType: "Alluvial", season: "Kharif", waterRequirement: "Moderate", price: 80 },
  { _id: 16, name: "Sesame (Til)", image: sesameseeds, category: "Oil Seeds", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Low", price: 120 },
  { _id: 17, name: "Safflower", image: safflowerseeds, category: "Oil Seeds", soilType: "Clay Loam", season: "Rabi", waterRequirement: "Low", price: 75 },
  { _id: 18, name: "Linseed", image: linseeds, category: "Oil Seeds", soilType: "Loamy", season: "Rabi", waterRequirement: "Low", price: 85 },
  { _id: 19, name: "Castor Seed", image: castorseeds, category: "Oil Seeds", soilType: "Black soil", season: "Kharif", waterRequirement: "Moderate", price: 45 },

  { _id: 20, name: "Tea", image: tealeaves, category: "Plantation Crops", soilType: "Acidic Soil", season: "Kharif", waterRequirement: "High", price: 200 },
  { _id: 21, name: "Coffee", image: coffee, category: "Plantation Crops", soilType: "Loamy", season: "Kharif", waterRequirement: "High", price: 25 },
  { _id: 22, name: "Coconut", image: coconut, category: "Plantation Crops", soilType: "Alluvial", season: "Kharif", waterRequirement: "High", price: 40 },
  { _id: 23, name: "Rubber", image: rubberplant, category: "Plantation Crops", soilType: "Alluvial", season: "Kharif", waterRequirement: "High", price: 150 },
  { _id: 24, name: "Cocoa", image: cocoa, category: "Plantation Crops", soilType: "Clay loam", season: "Kharif", waterRequirement: "High", price: 300 }
];

// VEGETABLES
export const Vegetables = [
  // full cleaned leafy, root, tuber, bulb, stem, fruit, pod & seed, cabbage, regional vegetables
  { _id: 25, name: "Spinach", image: spinach, category: "Leafy Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Low", price: 30 },
  { _id: 26, name: "Lettuce", image: lettuce, category: "Leafy Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Low", price: 40 },
  { _id: 27, name: "Kale", image: kale, category: "Leafy Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 50 },
  { _id: 28, name: "Fenugreek (Methi)", image: fengrukleaves, category: "Leafy Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Low", price: 25 },
  { _id: 29, name: "Amaranth leaves (Chaulai)", image: amaranthleaves, category: "Leafy Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Low", price: 28 },
  { _id: 30, name: "Mustard greens (Sarson)", image: mustardgreens, category: "Leafy Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Low", price: 26 },
  { _id: 31, name: "Coriander leaves (Cilantro)", image: corianderleaves, category: "Leafy Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Low", price: 60 },
  { _id: 32, name: "Curry leaves", image: curryleaves, category: "Leafy Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Moderate", price: 55 },
  { _id: 33, name: "Beet greens", image: beetgreens, category: "Leafy Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Low", price: 30 },

  { _id: 34, name: "Carrot", image: carrot, category: "Root Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Moderate", price: 35 },
  { _id: 35, name: "Beetroot", image: beetroots, category: "Root Vegetable", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Low", price: 32 },
  { _id: 36, name: "Radish", image: raddish, category: "Root Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "High", price: 20 },
  { _id: 37, name: "Turnip", image: turnip, category: "Root Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 22 },
  { _id: 38, name: "Sweet potato", image: sweetpotato, category: "Root Vegetable", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Low", price: 40 },
  { _id: 39, name: "Yam", image: yam, category: "Root Vegetable", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "High", price: 45 },
  { _id: 40, name: "Taro (Arbi)", image: arbi, category: "Root Vegetable", soilType: "Clay Loam", season: "Kharif", waterRequirement: "High", price: 48 },
  { _id: 41, name: "Elephant Foot Yam", image: elephantfootyam, category: "Root Vegetable", soilType: "Clay Loam", season: "Kharif", waterRequirement: "Moderate", price: 52 },

  { _id: 42, name: "Onion", image: onion, category: "Bulb Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 25 },
  { _id: 43, name: "Garlic", image: garlic, category: "Bulb Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Low", price: 80 },
  { _id: 44, name: "Shallot", image: shallot, category: "Bulb Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "Low", price: 50 },

  { _id: 45, name: "Brinjal (Eggplant)", image: brinjal, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 35 },
  { _id: 46, name: "Tomato", image: tomato, category: "Fruit Vegetable", soilType: "Sandy Loam", season: "Rabi", waterRequirement: "High", price: 45 },
  { _id: 47, name: "Cucumber", image: cucumber, category: "Fruit Vegetable", soilType: "Sandy Loam", season: "Kharif", waterRequirement: "Moderate", price: 35 },
  { _id: 48, name: "Capsicum", image: capsicum, category: "Fruit Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 60 },
  { _id: 49, name: "Pumpkin", image: pumpkin, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 35 },
  { _id: 50, name: "Bottle Gourd", image: bottlegourd, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 30 },
  { _id: 51, name: "Snake Gourd", image: snakegourd, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 30 },
  { _id: 52, name: "Sponge Gourd", image: spongegourd, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 30 },
  { _id: 53, name: "Turai (Ridge Gourd)", image: turai, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 32 },
  { _id: 54, name: "Zucchini", image: zucchini, category: "Fruit Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 55 },

  { _id: 55, name: "Broccoli", image: broccoli, category: "Cabbage Family", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 80 },
  { _id: 56, name: "Cabbage", image: cabbage, category: "Cabbage Family", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 60 },
  { _id: 57, name: "Cauliflower", image: cauliflower, category: "Cabbage Family", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 65 },
  { _id: 58, name: "Brussels Sprouts", image: brusselssprouts, category: "Cabbage Family", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 90 },
  { _id: 59, name: "Bok Choy", image: bokchoy, category: "Cabbage Family", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 70 },

  { _id: 60, name: "French Beans", image: frenchbeans, category: "Pod & Seed Vegetable", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 55 },
  { _id: 61, name: "Broad Beans", image: broadbeans, category: "Pod & Seed Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 50 },
  { _id: 62, name: "Green Peas", image: greenpeas, category: "Pod & Seed Vegetable", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 45 },
  { _id: 63, name: "Jackfruit", image: jackfruit, category: "Regional/Exotic", soilType: "Loamy", season: "Kharif", waterRequirement: "High", price: 35 },
  { _id: 64, name: "Jerusalem Artichoke", image: jerusalemarthichoke, category: "Regional/Exotic", soilType: "Loamy", season: "Kharif", waterRequirement: "Moderate", price: 75 },
  { _id: 65, name: "Asparagus", image: asparagus, category: "Regional/Exotic", soilType: "Loamy", season: "Rabi", waterRequirement: "Moderate", price: 120 }
];

// FRUITS
export const fruits = [
  { _id: 101, name: "Apple", image: apple, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 120 },
  { _id: 102, name: "Avocado", image: avocado, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 150 },
  { _id: 103, name: "Banana", image: banana, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 40 },
  { _id: 104, name: "Blueberry", image: blueberry, season: "Rabi", soilType: "Sandy Loam", waterRequirement: "Moderate", price: 200 },
  { _id: 105, name: "Dragonfruit", image: dragonfruit, season: "Kharif", soilType: "Sandy Loam", waterRequirement: "Moderate", price: 300 },
  { _id: 106, name: "Fig", image: fig, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 120 },
  { _id: 107, name: "Grapes", image: grapes, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 90 },
  { _id: 108, name: "Guava", image: guava, season: "Kharif", soilType: "Loamy", waterRequirement: "Moderate", price: 60 },
  { _id: 109, name: "Kiwi", image: kiwi, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 250 },
  { _id: 110, name: "Lemon", image: lemon, season: "Kharif", soilType: "Loamy", waterRequirement: "Moderate", price: 50 },
  { _id: 111, name: "Litchi", image: lichi, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 300 },
  { _id: 112, name: "Mango", image: mango, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 120 },
  { _id: 113, name: "Mangosteen", image: mangosteen, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 400 },
  { _id: 114, name: "Mosambi", image: mosambi, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 70 },
  { _id: 115, name: "Oranges", image: oranges, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 80 },
  { _id: 116, name: "Papaya", image: papaya, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 50 },
  { _id: 117, name: "Pineapple", image: pineapple, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 60 },
  { _id: 118, name: "Pomegranate", image: pomegranate, season: "Rabi", soilType: "Sandy Loam", waterRequirement: "Moderate", price: 120 },
  { _id: 119, name: "Rambutan", image: rambutan, season: "Kharif", soilType: "Loamy", waterRequirement: "High", price: 150 },
  { _id: 120, name: "Redberry", image: redberry, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 180 },
  { _id: 121, name: "Sapodilla", image: sapodilla, season: "Kharif", soilType: "Loamy", waterRequirement: "Moderate", price: 90 },
  { _id: 122, name: "Starfruit", image: starfruit, season: "Kharif", soilType: "Loamy", waterRequirement: "Moderate", price: 120 },
  { _id: 123, name: "Tangerine", image: tangerine, season: "Rabi", soilType: "Loamy", waterRequirement: "Moderate", price: 70 },
  { _id: 124, name: "Watermelon", image: watermelon, season: "Kharif", soilType: "Sandy Loam", waterRequirement: "High", price: 30 }
];

// PULSES
export const pulses = [
  { _id: 201, name: "Lentil", image: lentil, season: "Rabi", soilType: "Loamy", waterRequirement: "Low", price: 68 },
  { _id: 202, name: "Chickpea", image: chickpea, season: "Rabi", soilType: "Sandy Loam", waterRequirement: "Low", price: 74 },
  { _id: 203, name: "Pigeon Pea", image: pigeonPea, season: "Kharif", soilType: "Alluvial", waterRequirement: "Moderate", price: 37 },
  { _id: 204, name: "Green Gram", image: greenGram, season: "Kharif", soilType: "Sandy Loam", waterRequirement: "Low", price: 25 },
  { _id: 205, name: "Black Gram", image: blackGram, season: "Kharif", soilType: "Clay Loam", waterRequirement: "Moderate", price: 20 }
];



