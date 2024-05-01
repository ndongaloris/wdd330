import { setLocalStorage, getLocalStorage} from "./utils.mjs";

export default class ProductDetails{
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {}
        this.productList = [];
        this.dataSource = dataSource;
    }
    async init(){
        // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // once we have the product details we can render out the HTML
        this.renderProductDetail("main");
        // once the HTML is rendered we can add a listener to Add to Cart button
        // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
        // add listener to Add to Cart button
        document.getElementById("addToCart").addEventListener("click", this.addProductToCart.bind(this));
    }
    // add to cart button event 
    addProductToCart() {
        this.productList = getLocalStorage("so-cart");
        this.productList.push(this.product);
        setLocalStorage("so-cart", this.productList);
    }
    
    renderProductDetail(selector){
        // Use the HTML in the /product_pages/index.html as a template to create this function. Once you have the function working remember to remove the HTML from the index.html file so you don't have multiple products showing up!
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterbegin", ProductDetailsTemplate(this.product)
        );
    }
}

function ProductDetailsTemplate(product){
    return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    
    <img
        class="divider"
        src=${product.Image}
        alt=${product.Name}
    />

    <p class="product-card__price">${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>

    <div class="product-detail__add">
        <button id="addToCart" data-id=${product.Id}>Add to Cart</button>
    </div>
    </section>`
}



