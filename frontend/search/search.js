const template = document.createElement("template")

template.innerHTML = 
`
    <link rel="stylesheet" href="../search/search.css">

    <div class="search-component">
        <div class="search-list">
            search List
        </div>
    </div>
`

class Search extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback(){
        console.log("Hello")
    }
}

customElements.define("search-component", Search)