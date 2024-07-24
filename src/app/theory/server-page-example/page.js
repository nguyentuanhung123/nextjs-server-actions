import { fetchListOfProducts } from "@/actions";

const ServerActionsExample = async () => {


    const products = await fetchListOfProducts()
    // console.log("products", products);

    return (
        <div>
            <h1>Server actions example - server components</h1>
            <ul>
                {
                    products && products.length > 0 ?
                        products.map((item) => (
                            <li key={item.id}>
                                <p>{item.title}</p>
                            </li>
                        ))
                        : (
                            <h2>No product found</h2>
                        )
                }
            </ul>
        </div>
    )
}

export default ServerActionsExample;