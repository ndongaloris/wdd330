import { setLocalStorage, getLocalStorage, removeAllAlerts, alertMessage} from "./utils.mjs";
import { superscriptNumber } from "./SuperScriptNumber.mjs";

function renderTemplate(product){
    const discounted = product.FinalPrice < product.SuggestedRetailPrice ;
    const discount = (product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice * 100 ;
    return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <picture>
        <source srcset="${product.Images.PrimaryMedium}" media="(max-width: 400px)">
        <source srcset="${product.Images.PrimaryLarge}" media="(max-width: 800px)">
        <img
        src=${product.Images.PrimaryExtraLarge}
        alt=${product.Name}>
    </picture>
    ${discounted && `<div class="discount"> ${Math.round(discount)}% off</div>`}
    <p class="product-card__price">${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>

    <div class="product-detail__add">
        <button id="addToCart" data-id=${product.Id}>Add to Cart</button>
    </div>
    </section>`
}

export default class ProductDetails{
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.productList = [];
        this.dataSource = dataSource;
    }
    async init(){
        // const list = await this.dataSource.getData(this.productId);
        // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // once we have the product details we can render out the HTML
        this.renderProductDetails("main");
        // once the HTML is rendered we can add a listener to Add to Cart button
        // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
        // add listener to Add to Cart button
        document.getElementById("addToCart").addEventListener("click", () =>{
            removeAllAlerts();
            this.addToCart();
            alertMessage(`${this.product.Name} has been added to Cart`);
            superscriptNumber();
        })
    }
    addToCart(){
        this.productList = getLocalStorage("so-cart");
        if (this.productList === undefined || this.productList === null) this.productList = [];

        const findProduct = this.productList.filter((item) => item.Id === this.productId)
        if(findProduct.length !== 0) {
            findProduct[0].qty++;
            findProduct[0].FinalPrice *= findProduct[0].qty;

            // remove the product that you edited from the old product list
            this.productList = this.productList.filter((item) => item.Id !== this.productId)

            // now added the product with the new updated quantity back to the product list
            this.productList.push(findProduct[0]);

        } else {
            this.product.qty = 1
            this.productList.push(this.product);
        }

        setLocalStorage("so-cart", this.productList);
    }    
    renderProductDetails(selector){
        const element = document.querySelector(selector);
        element.insertAdjacentHTML("afterbegin", renderTemplate(this.product)
        );
    }
}


