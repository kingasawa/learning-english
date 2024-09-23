import { Button, H4, H5, Input, Label, Sheet, XStack, YStack } from "tamagui";
import { useTheme } from "@tamagui/core";
import { useState } from "react";
import { Replace } from "@tamagui/lucide-icons";
import { ScrollView, Text, View } from "react-native";
export function PrivacyAndPolicy() {
  return <DialogInstance />
}

function DialogInstance() {
  const spModes = ['percent', 'constant', 'fit', 'mixed'] as const
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(true)
  const [snapPointsMode, setSnapPointsMode] =
    useState<(typeof spModes)[number]>('percent')
  return (
    <>
      <Label
        size="$4"
        onPress={() => setOpen(true)}
        color="$primary"
      >
        Các chính sách và quyền riêng tư
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
              <H4 color="$primary" marginBottom={5}>CHÍNH SÁCH VÀ QUYỀN RIÊNG TƯ</H4>
              <Text>Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Khi bạn sử dụng ứng dụng của chúng tôi và đăng ký tài khoản, chúng tôi sẽ thu thập và sử dụng thông tin cá nhân của bạn theo các điều khoản sau:</Text>
              <View>
                <H5 color="$primary">1. Thông Tin Thu Thập</H5>
                <Text>
                  Chúng tôi thu thập các thông tin như tên, địa chỉ email, và các thông tin liên quan khác mà bạn cung cấp khi đăng ký hoặc sử dụng dịch vụ.
                </Text>
              </View>
              <View>
                <H5 color="$primary">2. Mục Đích Sử Dụng Thông Tin</H5>
                <Text>
                  Thông tin của bạn sẽ được sử dụng để quản lý tài khoản, cung cấp dịch vụ, và cải thiện trải nghiệm người dùng. Chúng tôi không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào, trừ khi có yêu cầu từ pháp luật.
                </Text>
              </View>
              <View>
                <H5 color="$primary">3. Bảo Mật Thông Tin</H5>
                <Text>
                  Chúng tôi thực hiện các biện pháp bảo mật cần thiết để bảo vệ thông tin cá nhân của bạn khỏi mất mát, truy cập trái phép hoặc lạm dụng.
                </Text>
              </View>
              <View>
                <H5 color="$primary">4. Quyền Lựa Chọn</H5>
                <Text>
                  Bạn có quyền truy cập, chỉnh sửa, hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào thông qua tài khoản của mình hoặc liên hệ với chúng tôi.
                </Text>
              </View>
              <View>
                <H5 color="$primary">9. Liên Hệ Với Chúng Tôi</H5>
                <Text>
                  Nếu bạn có bất kỳ câu hỏi nào về các Chính sách và quyền riêng tư này, vui lòng liên hệ với chúng tôi tại trancatkhanh@gmail.com.
                </Text>
              </View>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
