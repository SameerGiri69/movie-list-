const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starContainerStyle = {
  display: "flex",
  gap: "4px",
};
const textStyle = {
  lineHeight: "1",
  margin: "0",
};
export default function StarRating() {
  return (
    <div style={containerStyle}>
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <span>S{i + 1}</span>
        ))}
      </div>
      <p>10</p>
    </div>
  );
}
