import {useCheckbox, Chip, VisuallyHidden, tv} from "@nextui-org/react";

const checkbox = tv({
  slots: {
    base: "hover:bg-primary-100 px-1 h-7",
    content: "text-primary text-xs"
  },
  variants: {
    isSelected: {
      true: {
        base: "bg-primary hover:bg-primary-500",
        content: "text-primary-50 text-xs"
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
          color="primary"
          variant="flat"
          {...getLabelProps()}
        >
          {children ? children : isSelected ? "Enabled" : "Disabled"}
        </Chip>
    </label>
  );
}
