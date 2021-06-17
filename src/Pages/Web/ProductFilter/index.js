import BreadcrumbComponent from "Components/Web/Breadcrumb"
import SelectBlock from "Components/Web/Product/ProductShow/SelectBlock"
import { TYPE_PRODUCT } from "Constants/Data"
import { PATH } from "Constants/Path"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router"
import { changeActiveFilter } from "Redux/Product/Product.reducer"
import { getProductsFilterApi } from "Redux/Product/Product.thunk"
import "./ProductFilter.css"

const ProductFilter = () => {
    const { productType, p } = useParams()
    const history = useHistory()
    function useQuery() {
        return new URLSearchParams(p)
    }
    let params = useQuery()

    const productsFilter = useSelector(
        state => state.ProductReducer.productsFilter
    )
    const filters = useSelector(state => state.ProductReducer.filters)
    const dispatch = useDispatch()
    const [indexBlock, setIndexBlock] = useState(0)
    const getKeyBlock = () => {
        setIndexBlock(indexBlock + 1)
        return indexBlock + 1
    }

    //--------------------CHECK---------------------------

    const getParamsDefault = () => {
        switch (productType) {
            case TYPE_PRODUCT.LAPTOP:
                return {
                    laptop_rams: [],
                    laptop_screens: [],
                    laptop_cpus: [],
                    laptop_brands: [],
                    price: [],
                    page: 1
                }
            case TYPE_PRODUCT.DRIVE:
                return {
                    drive_types: [],
                    drive_capacities: [],
                    brand_drive: [],
                    price: [],
                    page: 1
                }
            default:
                return {}
        }
    }

    const getParams = () => {
        switch (productType) {
            case TYPE_PRODUCT.LAPTOP:
                return {
                    laptop_rams: [...params.getAll("ram")],
                    laptop_screens: [...params.getAll("screen")],
                    laptop_cpus: [...params.getAll("cpu")],
                    laptop_brands: [...params.getAll("brand")],
                    price: [],
                    page: 1
                }
            case TYPE_PRODUCT.DRIVE:
                return {
                    drive_types: [...params.getAll("types")],
                    drive_capacities: [...params.getAll("capacities")],
                    brand_drive: [...params.getAll("brand")],
                    price: [],
                    page: 1
                }
            default:
                return {}
        }
    }

    //--------------------GET DATA FIRST-------------------
    useEffect(() => {
        if (p === "all") {
            dispatch(getProductsFilterApi(productType, getParamsDefault()))
        } else {
            dispatch(getProductsFilterApi(productType, getParams()))
        }
    }, [])

    //-----------------GET DATA BY URL--------------------
    useEffect(() => {
        console.log("call api by url ", params.toString())
        dispatch(getProductsFilterApi(productType, getParams()))
    }, [productType, p])

    const [checkChange, setCheckChange] = useState(false)
    const changeRecord = (type, value) => {
        console.log(
            "🚀 ~ file: index.js ~ line 64 ~ changeRecord ~ type, value",
            type,
            value
        )
        //-------------------REDUX-----------------
        dispatch(changeActiveFilter({ type, value }))
        setCheckChange(!checkChange)
    }
    function isEmpty(obj) {
        if (obj) {
            return Object.keys(obj).length === 0
        }
        return false
    }

    useEffect(() => {
        if (p && !isEmpty(filters)) {
            let newParams = new URLSearchParams("")

            if (productType && productType === TYPE_PRODUCT.LAPTOP) {
                filters.brands.map(item =>
                    item.active === true
                        ? newParams.append("brand", item.id)
                        : ""
                )

                filters.rams.map(item =>
                    item.active === true
                        ? newParams.append("ram", item.value)
                        : ""
                )

                filters.screens.map(item =>
                    item.active === true
                        ? newParams.append("screen", item.value)
                        : ""
                )

                filters.cpus.map(item =>
                    item.active === true
                        ? newParams.append("cpu", item.value)
                        : ""
                )
            }
            if (productType && productType === TYPE_PRODUCT.DRIVE) {
                filters.brands.map(item =>
                    item.active === true
                        ? newParams.append("brand", item.id)
                        : ""
                )

                filters.types.map(item =>
                    item.active === true
                        ? newParams.append("types", item.value)
                        : ""
                )

                filters.capacities.map(item =>
                    item.active === true
                        ? newParams.append("capacities", item.value)
                        : ""
                )
            }
            // console.log("xxxxxxxxxxx>", newParams.toString())
            if (newParams.toString() !== "") {
                history.push(
                    `${PATH.HOME}/${productType}/filter/${newParams.toString()}`
                )
            } else {
                history.push(`${PATH.HOME}/${productType}/filter/all`)
            }
        }
    }, [checkChange])

    const renderFilter = (title, filterType, type) => {
        return (
            <div className="filter__icon">
                <div className="css_icon">
                    <div className="filter__text">{title}</div>
                    {filterType &&
                        filterType.map(item => {
                            return (
                                <div
                                    className={
                                        item.active
                                            ? "filter__box__active"
                                            : "filter__box"
                                    }
                                    key={item.value}
                                    onClick={() =>
                                        changeRecord(
                                            type,
                                            type && type === "brands"
                                                ? item.id
                                                : item.value
                                        )
                                    }
                                >
                                    <div className="filter__link">
                                        {item.value}
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }
    const renderLaptopFilters = () => {
        return (
            <div>
                {renderFilter("Thương hiệu", filters.brands, "brands")}
                {renderFilter("Cpu", filters.cpus, "cpus")}
                {renderFilter("Ram", filters.rams, "rams")}
                {renderFilter("Màn hình", filters.screens, "screens")}
            </div>
        )
    }
    const renderDriveFilters = () => {
        return (
            <div>
                {renderFilter("Thương hiệu", filters.brands, "brands")}
                {renderFilter("Loại ổ cứng", filters.types, "types")}
                {renderFilter("Dung lượng", filters.capacities, "capacities")}
            </div>
        )
    }

    return (
        <div>
            <BreadcrumbComponent pageName={"Bộ lọc sản phẩm"} />
            {/* <FilterBlock /> */}

            <div className="container">
                <div className="row">
                    <div className="filter">
                        <div className="filter__top">
                            <div className="filter__top-left" />
                            <div className="filter__top-right">BỘ LỌC</div>
                        </div>
                        {productType === TYPE_PRODUCT.LAPTOP
                            ? renderLaptopFilters()
                            : renderDriveFilters()}

                        <div
                            className="filter__icon"
                            style={{
                                borderTop: "1px solid rgba(0 , 0, 0, 0.125)",
                                margin: "10px 14px",
                                padding: "10px 0px"
                            }}
                        >
                            <div className="css_icon">
                                <div
                                    style={{ lineHeight: "4rem" }}
                                    className="filter__text"
                                >
                                    Sắp xếp theo giá
                                </div>
                                <div className="filter__box">Giá giảm dần</div>
                                <div className="filter__box">Giá tăng dần</div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Giá thấp nhất"
                                        maxLength="14"
                                        style={{
                                            border:
                                                "1px solid rgb(224, 224, 224)",
                                            marginTop: "5px",
                                            padding: "8px 20px",
                                            color: "#000",
                                            display: "inline-block",
                                            borderRadius: "4px0"
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        lineHeight: "3rem",
                                        margin: "0px 10px"
                                    }}
                                >
                                    _
                                </div>
                                <input
                                    type="text"
                                    placeholder="Giá cao nhất"
                                    maxLength="14"
                                    style={{
                                        border: "1px solid rgb(224, 224, 224)",
                                        marginTop: "5px",
                                        padding: "8px 20px",
                                        color: "#000",
                                        display: "inline-block",
                                        borderRadius: "4px0"
                                    }}
                                />
                                <button
                                    style={{
                                        background: "var(--color-primary)",
                                        border: "none",
                                        color: "rgb(255,255,255)",
                                        padding: "8px 20px",
                                        borderRadius: "4px",
                                        marginLeft: "5px",
                                        height: "40px",
                                        visibility: "visible",
                                        marginTop: "7px"
                                    }}
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* render data */}
            {
                <SelectBlock
                    key={() => getKeyBlock()}
                    selectBlockTitle={"Kết quả tìm kiếm"}
                    products={isEmpty(productsFilter) ? null : productsFilter}
                />
            }
        </div>
    )
}

export default ProductFilter
