import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product){
    return `<li class="product-card">
                <a href="product_pages/?product=${product.Id}">
                <img
                    src=${product.Image}
                    alt=${product.Name}
                />
                <h3 class="card__brand">${product.Brand.Name}</h3>
                <h2 class="card__name">${product.Name}</h2>
                <p class="product-card__price">${product.FinalPrice}</p></a
                >
            </li>`
}

export default class productList{
    constructor(category, dataSource, listElement){
        this.dataSource = dataSource;
        this.category = category;
        this.listElement = listElement;
    }
    async init(){
        const products = await this.dataSource.getData();
        this.tentFilter(products);
        this.renderList(this.tentFilter);
    }
    renderList(list){
        // const htmlString =  productList.map(productCardTemplate);
        // this.listElement.insertAdjacentHTML("afterbegin", htmlString.join(""));
        renderListWithTemplate(productCardTemplate, this.listElement, list)
    }
    tentFilter(list){
        const allProductId = ["880R", "985RF", "985PR","344YJ"];
        return list.filter(product => allProductId.includes(product.id));
    }
}