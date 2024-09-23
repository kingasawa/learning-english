import { Button, H4, H5, Input, Label, Sheet, XStack, YStack } from "tamagui";
import { useTheme } from "@tamagui/core";
import { useState } from "react";
import { Replace } from "@tamagui/lucide-icons";
import { View, Text, ScrollView } from "react-native";
export function TermsOfService() {
  return <DialogInstance />
}

function DialogInstance() {
  const spModes = ['percent', 'constant', 'fit', 'mixed'] as const
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(true)
  const [snapPointsMode, setSnapPointsMode] =
    useState<(typeof spModes)[number]>('percent')
  const theme = useTheme();
  return (
    <>
      <Label
        size="$4"
        onPress={() => setOpen(true)}
        color="$primary"
      >
        Các điều khoản dịch vụ
      </Label>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame style={{backgroundColor: '#ffffff'}} padding="$4" marginBottom={15} justifyContent="center" alignItems="center" gap="$5">
          <ScrollView>
          <YStack gap="$3">
            <H4 color="$primary" marginBottom={5}>ĐIỀU KHOẢN DỊCH VỤ</H4>
            <View>
              <H5 color="$primary">1. Chấp Nhận Điều Khoản</H5>
              <Text>
                Khi sử dụng ứng dụng của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều Khoản Dịch Vụ này. Nếu bạn không đồng ý với các điều khoản này, vui lòng không sử dụng ứng dụng của chúng tôi.
              </Text>
            </View>
            <View>
              <H5 color="$primary">2. Sử Dụng Ứng Dụng</H5>
              <Text>
                Bạn đồng ý sử dụng ứng dụng theo tất cả các luật và quy định hiện hành. Bạn không được sử dụng ứng dụng cho bất kỳ mục đích nào trái pháp luật hoặc không được phép.
              </Text>
            </View>
            <View>
              <H5 color="$primary">3. Đăng Ký Tài Khoản</H5>
              <Text>
                Để sử dụng một số tính năng của ứng dụng, bạn có thể cần tạo tài khoản. Bạn đồng ý cung cấp thông tin chính xác và đầy đủ trong quá trình đăng ký và duy trì thông tin tài khoản của bạn luôn được cập nhật.
              </Text>
            </View>
            <View>
              <H5 color="$primary">4. Trách Nhiệm Người Dùng</H5>
              <Text>
                Bạn chịu trách nhiệm duy trì sự bảo mật của tài khoản và mật khẩu của bạn và tất cả các hoạt động diễn ra dưới tài khoản của bạn. Bạn đồng ý thông báo ngay cho chúng tôi về bất kỳ việc sử dụng trái phép nào của tài khoản của bạn.
              </Text>
            </View>
            <View>
              <H5 color="$primary">5. Quyền Sở Hữu Tri Thức</H5>
              <Text>
                Tất cả nội dung và tài liệu có sẵn trên ứng dụng, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo và phần mềm, là tài sản của chủ sở hữu ứng dụng và được bảo vệ bởi luật sở hữu trí tuệ.
              </Text>
            </View>
            <View>
              <H5 color="$primary">6. Giới Hạn Trách Nhiệm</H5>
              <Text>
                Ứng dụng được cung cấp "như hiện tại" mà không có bất kỳ bảo đảm nào, dù là rõ ràng hay ngụ ý. Chúng tôi không đảm bảo rằng ứng dụng sẽ không có lỗi hoặc không bị gián đoạn. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng ứng dụng.
              </Text>
            </View>
            <View>
              <H5 color="$primary">7. Thay Đổi Điều Khoản</H5>
              <Text>
                Chúng tôi có thể cập nhật các Điều Khoản Dịch Vụ này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng các điều khoản mới trên trang web của chúng tôi hoặc trong ứng dụng. Việc bạn tiếp tục sử dụng ứng dụng sau khi có thay đổi này được coi là sự chấp nhận của bạn đối với các điều khoản mới.
              </Text>
            </View>
            <View>
              <H5 color="$primary">8. Chấm Dứt</H5>
              <Text>
                Chúng tôi bảo lưu quyền chấm dứt hoặc đình chỉ quyền truy cập của bạn vào ứng dụng bất kỳ lúc nào, mà không cần thông báo, nếu bạn vi phạm bất kỳ điều khoản nào trong số này.
              </Text>
            </View>
            <View>
              <H5 color="$primary">9. Liên Hệ Với Chúng Tôi</H5>
              <Text>
                Nếu bạn có bất kỳ câu hỏi nào về các Điều Khoản Dịch Vụ này, vui lòng liên hệ với chúng tôi tại trancatkhanh@gmail.com.
              </Text>
            </View>
          </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
