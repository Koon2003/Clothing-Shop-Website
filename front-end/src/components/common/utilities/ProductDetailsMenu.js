import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductDetailsMenu = ({ descriptionArray }) => {
    return (
        <Box sx={{ fontFamily: 'SFUFuturaBookOblique' }}> {/* Áp dụng font cho toàn bộ Box */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Mô Tả Sản Phẩm</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {descriptionArray.map((desc, index) => (
                            <Typography key={index} paragraph>
                                {desc}
                            </Typography>
                        ))}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            {/* Repeat for other sections */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Bảng Size</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ◼️ Size S : Chiều Cao 160cm-170cm - Cân Nặng 45-60kg
                        <br />
                        ◼️ Size M : Chiều Cao 165cm-175cm - Cân Nặng 60-70kg
                        <br />
                        ◼️ Size L : Chiều Cao 170cm-180cm - Cân Nặng 70-80kg
                        <br />
                        ◼️ Size XL : Chiều Cao 175cm-185cm - Cân Nặng 80-90kg
                        <br />
                        ◼️ Size XXL : Chiều Cao 180cm-190cm - Cân Nặng 90-100kg
                        <br />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Hướng Dẫn Sử Dụng Và Bảo Quản</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ◼️ Lần đầu đem về chỉ xả nước lạnh rồi phơi khô để sợi vải và màu áo không bị xù, phai màu nhé.
                        <br />
                        ◼️ Không nên ngâm bột giặt quá lâu.
                        <br />
                        ◼️ Lộn trái áo khi giặt và phơi.
                        <br />
                        ◼️ Không sử dụng nước tẩy.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Chính Sách Bảo Hành Và Đổi Trả</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        ◼️ Unbox sản phẩm và quay video chi tiết.
                        <br />
                        ◼️ Nếu sản phẩm lỗi thì liên hệ ngay với TAN để được giải quyết đổi trả nha (Trong vòng 7 ngày)
                        <br />
                        ◼️ Lưu ý : Các quy định đối với sản phẩm được đổi :
                        <br />
                        + Không có dấu hiệu bị bẩn, có mùi lạ hoặc dấu hiệu đã qua sử dụng.
                        <br />
                        + Có kèm hóa đơn hoặc xác nhận mua hàng.
                        <br />
                        + Có đầy đủ tag giấy và nhãn đính kèm sản phẩm.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ProductDetailsMenu;
