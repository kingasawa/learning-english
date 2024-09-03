import {Button, Input, Sheet } from "tamagui";
import { useTheme } from "@tamagui/core";
import { useState } from "react";
import { Replace } from "@tamagui/lucide-icons";
export function AIConfigModal() {
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
      <Button
        icon={Replace}
        onPress={() => setOpen(true)}
        backgroundColor={theme.primary}
        color="white"
        pressStyle={{ backgroundColor: theme.secondary }}
      >
        Conversation Context
      </Button>
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
        <Sheet.Frame style={{backgroundColor: '#e3e3e3'}} padding="$4" justifyContent="center" alignItems="center" space="$5">
          <Input width={200} />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
