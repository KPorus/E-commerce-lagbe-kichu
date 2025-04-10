import { cva, VariantProps } from "class-variance-authority";
import styles from "./button.module.scss";

const buttonStyles = cva(styles.btnContainer, {
	variants: {
		intent: {
			primary: styles.primary,
			secondary: styles.secondary,
			tertiary: styles.tertiary,
			addCart: styles.addCart,
			buyNow : styles.buyNow,
		},
		isSelected: {
			true: styles.selected,
			false: "",
		},
	},
	defaultVariants: {
		intent: "primary",
		isSelected: false,
	},
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
	text: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	Icon?: React.ReactNode;
	isSelected?: boolean;
}

// Button Component
export default function Button({
	Icon,
	intent,
	text,
	isSelected = false,
	...props
}: ButtonProps) {
	return (
		<button
			id="ts--common-button"
			className={buttonStyles({ intent, isSelected })}
			{...props}
		>
			{Icon && <span>{Icon}</span>}
			<span>{text}</span>
		</button>
	);
}
