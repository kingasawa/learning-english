import { Cog, X } from "@tamagui/lucide-icons"
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Paragraph,
  Sheet, TextArea,
  TooltipSimple,
  Unspaced,
  XStack,
} from "tamagui"
export function AIConfigModal() {
  return <DialogInstance />
}

function DialogInstance() {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button theme="blue_active" size="$4" icon={Cog}>Cá nhân hoá AI</Button>
      </Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet
          animation="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          snapPoints={[85, 50, 25]}
        >
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Thiết lập</Dialog.Title>
          <Dialog.Description>
            Tuỳ chỉnh nhân vật của bạn và AI, tiếp theo lựa chọn tình huống để giao tiếp
          </Dialog.Description>
          <Fieldset gap="$4" horizontal>
            <Label width={120} justifyContent="flex-end" htmlFor="username">
              Nhân vật của bạn
            </Label>
            <Input flex={1} id="username" placeholder="Học sinh" />
          </Fieldset>
          <Fieldset gap="$4" horizontal>
            <Label width={120} justifyContent="flex-end" htmlFor="ainame">
              Nhân vật của AI
            </Label>
            <Input flex={1} id="ainame" placeholder="Giáo viên tiếng anh" />
          </Fieldset>
          <Fieldset gap="$4" horizontal>
            <Label width={120} justifyContent="flex-end" htmlFor="context">
              Tình huống
            </Label>
            <TextArea flex={1} placeholder="Buổi trò chuyện giữa giáo viên tiếng anh và học sinh" />
          </Fieldset>
          <XStack alignSelf="flex-end" gap="$4">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="active" aria-label="Close">
                Bắt đầu trò chuyện
              </Button>
            </Dialog.Close>
          </XStack>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}