import {useCheckbox, Chip, VisuallyHidden, tv} from "@nextui-org/react";

const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200",
    content: "text-default-400 text-xs"
  },
  variants: {
    isSelected: {
      true: {
        base: "border-primary bg-primary hover:bg-primary-500 hover:border-primary-500",
        content: "text-primary-foreground"
      }
    },
    isFocusVisible: {
      true: { 
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      }
    }
  }
})

export const CustomCheckbox = (props) => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props
  })

  const styles = checkbox({ isSelected, isFocusVisible })

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
        <Chip
          classNames={{
            base: styles.base(),
            content: styles.content(),
          }}
          style={{marginRight: '9px'}}
          color="primary"
          variant="faded"
          {...getLabelProps()}
        >
          {children ? children : isSelected ? "Enabled" : "Disabled"}
        </Chip>
    </label>
  );
}
