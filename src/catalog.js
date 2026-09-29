import {foodShops} from './shops/food.js';
import {dailyShops} from './shops/daily.js';
import {serviceShops} from './shops/service.js';
import {marketShops} from './shops/markets.js';
import {retailShops} from './shops/retail.js';
import {urbanBuildings} from './urban/buildings.js';
export const assets=[...foodShops,...dailyShops,...serviceShops,...marketShops,...retailShops,...urbanBuildings];
export const byId=new Map(assets.map(a=>[a.id,a]));
export const lots=[];
function row(ids,start,z,rotation,zone,gaps=.65){let x=start;ids.forEach((id,i)=>{const a=byId.get(id);if(!a)throw Error('Missing asset '+id);x+=a.width/2;lots.push({instance:`${id}_${lots.filter(l=>l.asset===id).length+1}`,asset:id,x,z:z+[0,.12,-.08,.23,-.06,.1][i%6],rotation,zone});x+=a.width/2+gaps;});}
// A continuous two-sided shopping street, interrupted by a real cross street.
row(['sento','wagashi','produce','fishmonger'],-36,-5.1,0,'market-west');
row(['ramen','izakaya','curry','sushi','arcade','convenience'],5.8,-5.1,0,'dining-east');
row(['barber','laundry','cycle','pharmacy','record'],-37,5.1,Math.PI,'daily-west');
row(['florist','bakery','deli','bookstore','cafe'],5.8,5.1,Math.PI,'shopping-east');
// Upper floors and a second band of quieter buildings make the shops part of a neighborhood.
row(['apartment','townhouse','closedshop','clinic'],-36,-17,0,'north-west',1.15);
row(['apartment','townhouse','apartment','closedshop'],6.5,-17.2,0,'north-east',1.25);
row(['post','apartment','townhouse'],-36,17.2,Math.PI,'south-west',1.4);
row(['shrine','townhouse'],10.5,17.2,Math.PI,'south-east',2.2);
export const district={width:89,depth:52,centerX:3.5,centerZ:0,ground:.27,mainStreetZ:0,crossStreetX:0};
