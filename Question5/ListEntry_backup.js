//import productData from './products.json';

Vue.component('product-listentry', {
	data: function () {
		return {
			editting: false,
			new_name: "",
			new_price: 0,
			new_description: ""
		}
	},
	props: ['product'],
	template: `<div class="row product-entry">
			<div class="col-xs-4 product-image-col">
				<img v-bind:src="product.imageSrc" v-bind:alt="product.name"/>
			</div>
			<div class="col-xs-6" v-if="!editting">
				<div class="row"><div class="col-xs-12 product-name">{{product.name}}</div></div>
				<div class="row"><div class="col-xs-12 product-price" v-if="product!=null"> <span v-if="product.id>-1">&#36;{{product.price.toFixed(2)}}</span></div></div>
				<div class="row"><div class="col-xs-12 product-description">{{product.description}}</div></div>
			</div>
			<div class="col-xs-6" v-if="editting">
				<div class="row"><div class="col-xs-12 product-name"><input v-model="new_name"/></div></div>
				<div class="row"><div class="col-xs-12 product-price"><input type="number" v-model="new_price"/></div></div>
				<div class="row"><div class="col-xs-12 product-description"><textarea v-model="new_description"></textarea></div></div>
			</div>
			<div class="col-xs-2">
				<button v-on:click="EditProduct"  v-if="!editting">{{(product.id>=0)?"Edit":"New"}}</button>
				<button v-on:click="CancelEdit"  v-if="editting">Cancel</button>
				<button v-on:click="SaveEdit"  v-if="editting">Save</button>
			</div>
		</div>`,

	methods:{
		EditProduct: function(){
			this.new_name = this.product.name;
			this.new_price = this.product.price;
			this.new_description = this.product.description;
			this.editting = true;
		},
		SaveEdit: function(){
			this.editting = false;
			if (this.product.id == -1)
			{
				app.products.push({id: app.products.length, name: this.new_name, price: parseFloat(this.new_price), description: this.new_description});
				
			}
			else
			{
				this.product.name = this.new_name;
				this.product.price = parseFloat(this.new_price);
				this.product.description = this.new_description;
			}
			app.getFilteredProducts();
			app.saveToJSON();
		},
		CancelEdit: function(){
			this.editting = false;
		}
	}
})

var app = new Vue({
	el: '#app',
	data:{
	products: [{id: 0, name: "test product 1", price: 1, description: "This is purely for testing.", imageSrc: "Images/test1.png"},
		{id: 1, name: "circle", price: 10, description: "One of the 2 images involved.", imageSrc: "Images/test1.png"},
		{id: 2, name: "oval", price: 300, description: "There may be enough random things to put in these.", imageSrc: "Images/test1.png"},
		{id: 3, name: "test product 4", price: 30, description: "A test of the other image.", imageSrc: "Images/test2.png"},
		{id: 4, name: "square", price: 200, description: "test", imageSrc: "Images/test2.png"},
		{id: 5, name: "sphere", price: 95, description: "Not realy a sphere.", imageSrc: "Images/test1.png"},
		{id: 6, name: "round", price: 115, description: "test", imageSrc: "Images/test1.png"},
		{id: 7, name: "rectangle", price: 130, description: "test", imageSrc: "Images/test2.png"},
		{id: 8, name: "white", price: 160, description: "test", imageSrc: "Images/test1.png"},
		{id: 9, name: "hollow", price: 178, description: "test", imageSrc: "Images/test1.png"},
		{id: 10, name: "cube", price: 200, description: "test", imageSrc: "Images/test2.png"},
		{id: 11, name: "red", price: 260, description: "test", imageSrc: "Images/test2.png"}],
		filter_name: "",
		filter_minPrice: null,
		filter_maxPrice: null,
		filter_description: "",
		displayedProducts: [],
		sort_value: "id",
		sort_asc: true,
		newProduct: {id: -1, name:"", price:0, description:""},
		creatingNewProduct: false
	},
	methods:{
		getFilteredProducts: function(){
			var results = this.products;

			if (this.filter_name!=""){
				results = results.filter(f=>f.name.toLowerCase().includes(this.filter_name.toLowerCase()));
			}
			if (this.filter_description!=""){
				results = results.filter(f=>f.description.toLowerCase().includes(this.filter_description.toLowerCase()));
			}
			if (this.filter_minPrice != null){
				results = results.filter(f=>f.price >= this.filter_minPrice);
			}
			if (this.filter_maxPrice != null && this.filter_maxPrice > 0){
				results = results.filter(f=>f.price <= this.filter_maxPrice);
			}

			if (this.sort_value == "id"){
				results = results.sort((a,b)=>{return (a.id-b.id) * this.sortAscending();})
			} else if (this.sort_value == "price"){
				results = results.sort((a,b)=>{return (a.price-b.price) * this.sortAscending();})
			} else if (this.sort_value == "name"){
				results = results.sort((a,b)=>{return (a.name.toLowerCase()>b.name.toLowerCase() ? 1 : -1) * this.sortAscending();})
			}

			this.displayedProducts = results;
		},
		sortAscending: function(){
			return this.sort_asc?1:-1;
		},
		saveToJSON: function(){
			var jsonform = JSON.stringify(this.products);
			//console.log(jsonform);
			
			var file = new Blob([jsonform], {type: "text/plain;charset=utf-8"});
			//var FileSaver = require('file-saver');
			//FileSaver.saveAs(file, "products.json");
			//require("fs").writeFile("products.json", jsonform);
		}
	}
})
