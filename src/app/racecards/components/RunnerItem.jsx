// src/app/racecards/components/RunnerItem.jsx
"use client";

export default function RunnerItem({ runner }) {
  // If runner is ever null/undefined, bail out early:
  if (!runner) return null;

  // Pull quotes (if it exists) or default to empty array:
  const quotes = Array.isArray(runner.quotes) ? runner.quotes : [];

  // Safely pick the latest quote if available:
  const latestQuote =
    quotes.length > 0 ? quotes[quotes.length - 1].quote : null;

  return (
    <li key={runner.horse_id} className="card" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* Silk image or placeholder */}
        <div
          style={{
            flexShrink: 0,
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {runner.silk_url ? (
            <img
              src={runner.silk_url}
              alt={`${runner.horse} silk`}
              style={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                backgroundColor: "#F3F4F6",
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#F3F4F6",
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#6B7280" }}>No Silk</span>
            </div>
          )}
        </div>

        {/* Runner details */}
        <div
          style={{
            flex: 1,
            padding: "1rem",
            borderLeft: "1px solid #F3F4F6",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {runner.horse}{" "}
            <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              ({runner.age}, {runner.sex})
            </span>
          </p>

          <p style={{ marginTop: "0.25rem", color: "#374151" }}>
            <strong>Trainer:</strong> {runner.trainer}
          </p>

          {runner.comment && (
            <p
              style={{
                marginTop: "0.5rem",
                fontStyle: "italic",
                color: "#374151",
              }}
            >
              {runner.comment}
            </p>
          )}

          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              color: "#374151",
            }}
          >
            <span>
              <strong>Form:</strong> {runner.form || "N/A"}
            </span>
            <span>
              <strong>RPR:</strong> {runner.rpr || "N/A"}
            </span>
          </div>

          {latestQuote && (
            <p
              style={{
                marginTop: "0.75rem",
                color: "#4F46E5",
                fontStyle: "italic",
              }}
            >
              “{latestQuote}”
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
