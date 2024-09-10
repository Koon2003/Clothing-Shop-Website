import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { fetchAllProducts } from "../../redux/actions/productActions";
import ProductItem from "./ProductItem";

const TShirt = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    // Hiển thị loading spinner hoặc thông báo nếu dữ liệu đang được tải
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                style={{ paddingTop: '20px', paddingBottom: '30px', fontFamily: 'SFUFuturaBookOblique' }}
            >
                ÁO PHÔNG
            </Typography>
            <ProductItem category="ao-phong"/>
        </div>
    );
};

export default TShirt;