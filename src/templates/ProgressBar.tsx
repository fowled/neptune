function ProgressBar(props: { width: string; start: string; end: string }) {
	return (
		<>
			<div className="flex justify-between text-sm mb-2">
				<p>{props.start}</p>
				<p>{props.end}</p>
			</div>

			<div className="w-full bg-black rounded-full h-1.5">
				<div className="bg-white h-1.5 rounded-full" style={{ width: props.width }}></div>
			</div>
		</>
	);
}

export default ProgressBar;
