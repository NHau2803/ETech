// import { useEffect } from "react"
import ProductBlock from "../ProductBlock"
// import Slider from "react-slick"

const SelectBlock = props => {
    const { selectBlockTitle, products, brandId } = props

    return (
        <div className="section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-title">
                            <h2 className="title">{selectBlockTitle}</h2>
                        </div>
                    </div>

                    {products.map(item => {
                        return (
                            <ProductBlock
                                key={item.id}
                                brandId={brandId}
                                id={item.id}
                                image={item.images}
                                name={item.name}
                                spec1={item.spec1}
                                spec2={item.spec2}
                                price={item.price}
                                guarantee={item.guarantee}
                                valueSale={"-10%"}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default SelectBlock
