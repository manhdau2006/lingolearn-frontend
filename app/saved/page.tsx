export default function FolderDetailsPage({ params }: { params: { folderID: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thư mục: {params.folderID}</h1>
      {/* Vùng chứa danh sách từ vựng sẽ được thêm sau */}
    </div>
  );
}