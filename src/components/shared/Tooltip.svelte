<script lang="ts">
	let visibility = "visibility: hidden;",
		pos: DOMRect,
		offsetWidth: number,
		offsetHeight: number;

	$: el?.addEventListener("mouseenter", (e) => {
		const target = e.target as HTMLElement;

		pos = target.getBoundingClientRect();

		offsetWidth = target.offsetWidth;
		offsetHeight = target.offsetHeight;

		return (visibility = "visibility: visible;");
	});

	$: el?.addEventListener("mouseleave", () => {
		return (visibility = "visibility: hidden;");
	});

	$: placeTop = `top: ${pos?.top - top}px;`;
	$: placeLeft = `left: ${pos?.left + left}px;`;

	$: calculateMargin = ["top", "bottom"].includes(direction)
		? `margin-left: ${offsetWidth / 2}px;`
		: `margin-top: ${offsetHeight / 2}px;`;

	export let content: string,
		direction: "top" | "bottom" | "left" | "right",
		el: HTMLElement,
		left = 0,
		top = 0;
</script>

<div class="{$$props.class} tooltip {direction}" style="{placeTop} {placeLeft} {calculateMargin} {visibility}">
	{content}
</div>

<style lang="scss">
	.tooltip {
		font-size: 0.875rem;
		line-height: 1.25rem;
		pointer-events: none;
		position: fixed;
		z-index: 50;
		width: max-content;
		border-radius: 0.5rem;
		background-color: black;
		padding: 0.5rem 0.75rem 0.5rem 0.75rem;
		text-align: center;
		color: white;

		&::after {
			position: absolute;
			border-width: 6px;
		}

		&.top,
		&.bottom {
			transform: translateX(-50%);
		}

		&.left,
		&.right {
			transform: translateY(-50%);
		}

		&.top::after {
			content: "";
			transform: translateX(-50%);
			bottom: 0;
			left: 50%;
			margin-bottom: -11px;
			border-color: black transparent transparent transparent;
		}

		&.bottom::after {
			content: "";
			transform: translateX(-50%);
			top: 0;
			left: 50%;
			margin-top: -11px;
			border-color: transparent transparent black transparent;
		}

		&.right::after {
			content: "";
			transform: translateY(-50%);
			left: 0;
			top: 50%;
			margin-left: -11px;
			border-color: transparent black transparent transparent;
		}

		&.left::after {
			content: "";
			transform: translateY(-50%);
			right: 0;
			top: 50%;
			margin-right: -11px;
			border-color: transparent transparent transparent black;
		}
	}
</style>
