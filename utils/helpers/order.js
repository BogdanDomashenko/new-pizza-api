exports.parseOrderProps = (props) => {
	const splited = props.split(" ");
	return { type: splited[0], size: splited[1] }
}