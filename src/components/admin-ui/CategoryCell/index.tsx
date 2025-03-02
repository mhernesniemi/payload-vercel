import Link from "next/link";
import { DefaultCellComponentProps } from "payload";
import React from "react";

export const CategoryCell: React.FC<DefaultCellComponentProps> = ({
  rowData,
  cellData,
  collectionSlug,
  link,
}) => {
  const url = `http://${process.env.NEXT_PUBLIC_SITE_URL}/admin/collections/${collectionSlug}/${rowData.id}`;

  const parentTitle = (rowData.breadcrumbs?.length > 1 && rowData.breadcrumbs[0].label) ?? null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {rowData.parent && (
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M6 19V8.5h11.079l-3.792-3.786L14 4l5 5l-5.006 5.006l-.707-.714L17.079 9.5H7V19z" />
          </svg>
        </div>
      )}
      {link ? (
        <Link href={url}>
          {cellData} {parentTitle && <span style={{ opacity: 0.5 }}>({parentTitle})</span>}
        </Link>
      ) : (
        <span>{cellData}</span>
      )}
    </div>
  );
};
