export default function AmbientBackground({ score = 70 }) {

  // ===============================
  // COLOR STATES
  // ===============================
  const getGradient = () => {

    // Healthy
    if (score > 70)
      return `
        radial-gradient(circle at 20% 20%, #9381FF33, transparent 40%),
        radial-gradient(circle at 80% 80%, #B8B8FF33, transparent 45%),
        #F8F7FF
      `;

    // Moderate
    if (score > 40)
      return `
        radial-gradient(circle at 25% 25%, #f59e0b22, transparent 40%),
        radial-gradient(circle at 75% 75%, #B8B8FF33, transparent 45%),
        #F8F7FF
      `;

    // Critical
    return `
      radial-gradient(circle at 20% 20%, #ef444422, transparent 40%),
      radial-gradient(circle at 80% 80%, #f59e0b22, transparent 45%),
      #F8F7FF
    `;
  };

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-[1500ms]"
      style={{
        background: getGradient(),
      }}
    />
  );
}
    