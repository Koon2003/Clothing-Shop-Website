import React from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Footer from "../../../components/common/footer/Footer";
import PageHeader from "../../../components/common/header/PageHeader";


const ShippingPolicyPage = () => {
    const shippingTable = (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Phạm Vi</TableCell>
                        <TableCell align="right">Phí Ship</TableCell>
                        <TableCell align="right">Thời gian</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            Thành phố Hà Nội
                        </TableCell>
                        <TableCell align="right">25.000</TableCell>
                        <TableCell align="right">{"<"}18h</TableCell>
                    </TableRow>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            Thành phố Hà Nội
                        </TableCell>
                        <TableCell align="right">20.000</TableCell>
                        <TableCell align="right">{"<"}48 giờ</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );

    const policySections = [
        {
            title: "2. Khách hàng ở các tỉnh thành khác",
            content: ` 
            Tan Boutique đã kết hợp với các hãng Vận chuyển uy tín hàng đầu tại Việt Nam như Giao hàng tiết kiệm, VNPost, Viettel Post,... để phục vụ giao hàng cho các khách ở các khu vực tỉnh thành khác.

            Thời gian giao hàng và chi phí vận chuyển sẽ tùy vào đơn vị vận chuyện. Sau khi nhận được đơn hàng, Tan Boutique sẽ liên hệ trực tiếp cho Quý khách để báo chính xác mức phí vận chuyển .
            
            Quí khách vui lòng kiểm tra hàng ngay khi nhận bưu kiện từ đơn vị vận chuyển, đồng thời thông báo cho Tan Boutique nếu hàng bị hư hỏng do vận chuyển
        `
        },
        {
            title: "3. Các lưu ý",
            content: `
            Dịch vụ vận chuyển của Tan Boutique sẽ chịu trách nhiệm với hàng hóa và các rủi ro như mất mát hoặc hư hại của hàng hóa trong suốt quá trình vận chuyển hàng từ kho hàng Tan Boutique đến khách hàng.

            Khi sản phẩm được giao tới, sản phẩm phải còn nguyên đai, nguyên kiện, còn niêm phong, chưa có dấu hiệu bóc mở... đầy đủ chứng từ của Tan Boutique , nếu khách hàng thấy bất thường có thể từ chối nhận hàng và liên hệ ngay Bộ phận chăm sóc khách hàng của Tan Boutique  để xử lý ngay ( Hotline: 0933773448 hoặc  Email: cskh@theTan Boutique.com)

            Sau khi khách hàng đã ký nhận hàng mà không ghi chú hoặc có ý kiến về hàng hóa. Tan Boutique  không có trách nhiệm với những yêu cầu đổi trả vì hư hỏng, trầy xước, bể vỡ, mốp méo, sai hàng hóa… từ khách hàng sau này.

            Trong trường hợp giao hàng chậm trễ mà không báo trước, khách hàng có thể từ chối nhận hàng và Tan Boutique sẽ hoàn trả toàn bộ số tiền mà khách hàng đã trả trước (nếu có) trong vòng 14 ngày làm việc.

            - Tan Boutique cam kết tất cả hàng hóa gửi đến khách hàng theo đơn hàng đều là hàng  mới 100%.
        `
        }
    ];


    return (
        <>
            <PageHeader />
            <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Typography variant="h4" style={{ marginBottom: '1rem', fontFamily: 'SFUFuturaBookOblique' }}>
                    Chính sách bảo mật thông tin cá nhân
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontFamily: 'SFUFuturaBookOblique' }}>
                        1. Khách hàng thành phố Hà Nội
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'SFUFuturaBookOblique' }}>
                        Đối với các khách hàng ở những khu vực thành phố Hồ Chí Minh, đội ngũ Shipper của Tan Boutique  sẽ trực tiếp giao hàng đến tận nơi cho Quý khách trong thời gian sớm nhất trong vòng 48 giờ (trừ Chủ Nhật và các ngày Lễ, Tết). Chúng tôi sẽ liên lạc trước khi giao hàng.
                    </Typography>
                    {shippingTable}
                </Box>
                {policySections.map((section, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontFamily: 'SFUFuturaBookOblique' }}>
                            {section.title}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'SFUFuturaBookOblique' }}>
                            {section.content}
                        </Typography>
                    </Box>
                ))}
            </Container>
            <Footer />
        </>
    );
};

export default ShippingPolicyPage;