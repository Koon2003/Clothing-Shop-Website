import React from "react";
import { Container, Typography, Box } from "@mui/material";
import PageHeader from "../../../components/common/header/PageHeader";
import Footer from "../../../components/common/footer/Footer";

const PrivacyPolicyPage = () => {
  const policySections = [
    {
      title: "1. Mục đích thu thập",
      content: `Chúng tôi thu thập thông tin cá nhân chỉ cần thiết nhằm phục vụ cho các mục đích:

            -      Đơn Hàng: để xử lý các vấn đề liên quan đến đơn đặt hàng của bạn;
        
            -      Duy Trì Tài Khoản: để tạo và duy trình tài khoản của bạn với chúng tôi, bao gồm cả các chương trình khách hàng thân thiết hoặc các chương trình thưởng đi kèm với tài khoản của bạn;
        
            -      Dịch Vụ Chăm Sóc Khách Hàng: bao gồm các phản hồi cho các yêu cầu, khiếu nại và phản hồi của bạn;
        
            -      Cá Nhân Hóa: Chúng tôi có thể tổ hợp dữ liệu được thu thập để có một cái nhìn hoàn chỉnh hơn về một người tiêu dùng và từ đó cho phép chúng tôi phục vụ tốt hơn với sự cá nhân hóa mạnh hơn ở các khía cạnh, bao gồm nhưng không giới hạn:
        
            Để cải thiện và cá nhân hóa trải nghiệm của bạn trên trang mua sắm thương mại điện tử coolmate.me
            Để cải thiện các tiện ích, dịch vụ, điều chỉnh chúng phù hợp với các nhu cầu được cá thể hóa và đi đến những ý tưởng dịch vụ mới
            Để phục vụ bạn với những giới thiệu, quảng cáo được điều chỉnh phù hợp với sự quan tâm của bạn.
        
            -      An Ninh: cho các mục đích ngăn ngừa các hoạt động phá hủy tài khoản người dùng của khách hàng hoặc các hoạt động giả mạo khách hàng.
        
            -      Theo yêu cầu của pháp luật: tùy quy định của pháp luật vào từng thời điểm, chúng tôi có thể thu thập, lưu trữ và cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.`,
    },
    {
      title: "2. Phạm vi thu thập",
      content: ` Chúng tôi thu thập thông tin khách hàng khi:

            -   Khách hàng giao dịch trực tiếp với chúng tôi
                    Thông tin cá nhân của các bạn cung cấp chủ yếu trên trang mua sắm điện tử của chúng tôi coolmate.me. Thông tin bao gồm: Họ tên, ngày sinh, địa chỉ, số điện thoại, email, tên đăng nhập và mật khẩu (Tài khoản đăng nhập), câu hỏi/ câu trả lời bảo mật, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.
        
                    Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lý do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, bạn có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên trang web. Tại đây, bạn sẽ thấy chi tiết đơn đặt hàng của mình, những sản phẩm đã nhận và những sản phẩm đã gửi và chi tiết email, ngân hàng và bản tin mà bạn đặt theo dõi dài hạn.
        
            -   Khách hàng tương tác với chúng tôi
                    Chúng tôi sử dụng cookies và công nghệ dấu khác để thu thập một số thông tin khi bạn tương tác với trang mua sắm.
        
                    Chúng tôi dùng cookie để tiện cho bạn vào trang web (ví dụ: ghi nhớ tên truy cập khi bạn muốn vào thay đổi lại giỏ mua hàng mà không cần phải nhập lại địa chỉ email của mình) và không đòi hỏi bất kỳ thông tin nào về bạn (ví dụ: mục tiêu quảng cáo).Trình duyệt của bạn có thể được thiết lập không sử dụng cookie nhưng điều này sẽ hạn chế quyền sử dụng của bạn trên trang web. Xin vui lòng chấp nhận cam kết của chúng tôi là cookie không bao gồm bất cứ chi tiết cá nhân riêng tư nào và an toàn với virus.
        
            -   Các nguồn hợp pháp khác
                    Chúng tôi có thể thu thập thông tin của bạn trên các nguồn hợp pháp khác.
        `,
    },
    {
      title: "3. Thời gian lưu trữ",
      content: `
            -   Thông tin khách hàng được lưu trữ cho đến khi nhận được yêu cầu huỷ bỏ của khách hàng, hoặc khách hàng tự đăng nhập để huỷ bỏ.

            -   Mọi thông tin của khách hàng đều được lưu trữ trên máy chủ của Coolmate.me`,
    },
    {
      title: "4. Thông tin Khách hàng đối với bên thứ ba",
      content: `  Chúng tôi cam kết không cung cấp thông tin khách hàng với bất kì bên thứ ba nào, trừ những trường hợp sau:

            -   Các đối tác là bên cung cấp dịch vụ cho chúng tôi liên quan đến thực hiện đơn hàng và chỉ giới hạn trong phạm vi thông tin cần thiết cũng như áp dụng các quy định đảm bảo an ninh, bảo mật các thông tin cá nhân.
            
            -   Chúng tôi có thể sử dụng dịch vụ từ một nhà cung cấp dịch vụ là bên thứ ba để thực hiện một số hoạt động liên quan đến trang mua sắm điện tử Coolmate.me và khi đó bên thứ ba này có thể truy cập hoặc xử lý các thông tin cá nhân trong quá trình cung cấp các dịch vụ đó. Chúng tôi yêu cầu các bên thứ ba này tuân thủ mọi luật lệ về bảo vệ thông tin cá nhân liên quan và các yêu cầu về an ninh liên quan đến thông tin cá nhân.
            
            -   Các chương trình có tính liên kết, đồng thực hiện, thuê ngoài cho các mục địch được nêu tại Mục 1 và luôn áp dụng các yêu cầu bảo mật thông tin cá nhân.
            
            -   Yêu cầu pháp lý: Chúng tôi có thể tiết lộ các thông tin cá nhân nếu điều đó do luật pháp yêu cầu và việc tiết lộ như vậy là cần thiết một cách hợp lý để tuân thủ các quy trình pháp lý.
            
            -   Chuyển giao kinh doanh (nếu có): trong trường hợp sáp nhập, hợp nhất toàn bộ hoặc một phần với công ty khác, người mua sẽ có quyền truy cập thông tin được chúng tôi lưu trữ, duy trì trong đó bao gồm cả thông tin cá nhân.
            `,
    },
    {
      title: "5. An toàn dữ liệu",
      content: `Chúng tôi luôn nỗ lực để giữ an toàn thông tin cá nhân của khách hàng, chúng tôi đã và đang thực hiện nhiều biện pháp an toàn, bao gồm:

            -   Bảo đảm an toàn trong môi trường vận hành: chúng tôi lưu trữ thông tin cá nhân khách hàng trong môi trường vận hành an toàn và chỉ có nhân viên, đại diện và nhà cung cấp dịch vụ có thể truy cập trên cơ sở cần phải biết. Chúng tôi tuân theo các tiêu chuẩn ngành, pháp luật trong việc bảo mật thông tin cá nhân khách hàng.
        
            -   Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân khách hàng, chúng tôi sẽ có trách nhiệm thông báo vụ việc cho cơ quan chức năng để điều tra xử lý kịp thời và thông báo cho khách hàng được biết.
        
            -   Các thông tin thanh toán: được bảo mật theo tiêu chuẩn ngành.
        `,
    },
    {
      title: "6. Quyền lợi của khách hàng đối với thông tin cá nhân",
      content: `  
            -   Khách hàng có quyền cung cấp thông tin cá nhân cho chúng tôi và có thể thay đổi quyết định đó vào bất cứ lúc nào.

            -   Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản và chỉnh sửa thông tin cá nhân hoặc yêu cầu chúng tôi thực hiện việc này.`,
    },
    {
      title: "7. Yêu cầu xóa bỏ thông tin cá nhân",
      content: ` -   Khách hàng có quyền yêu cầu xóa bỏ hoàn toàn các thông tin cá nhân lưu trữ trên hệ thống của chúng tôi bất cứ khi nào.

            -   Khách hàng gửi thư điện tử về địa chỉ cool@coolmate.me để yêu cầu xóa bỏ thông tin cá nhân hoàn toàn khỏi hệ thống.`,
    },
    {
      title: "8. Thông tin liên hệ",
      content: `-   Nếu bạn có câu hỏi hoặc bất kỳ thắc mắc nào về Chính Sách này hoặc thực tế việc thu thập, quản ly thông tin cá nhân của chúng tôi, xin vui lòng liên hệ với chúng tôi bằng cách:

            Gọi điện thoại đến hotline: 1900272737
            Gửi thư điện tử đến địa chỉ email: Cool@coolmate.me`,
    },
  ];

  return (
    <>
      <PageHeader />
      <Container
        maxWidth="md"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <Typography
          variant="h4"
          style={{ marginBottom: "1rem", fontFamily: "SFUFuturaBookOblique" }}
        >
          Chính sách bảo mật thông tin cá nhân
        </Typography>
        {policySections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontFamily: "SFUFuturaBookOblique",
              }}
            >
              {section.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontFamily: "SFUFuturaBookOblique",
              }}
            >
              {section.content}
            </Typography>
          </Box>
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
