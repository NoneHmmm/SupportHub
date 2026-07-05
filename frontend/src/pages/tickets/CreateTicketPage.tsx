import { useState } from "react";
import { useNavigate } from "react-router";
import useTicketStore from "../../stores/useTicketStore";
import { Button, Input, Textarea, Select } from "../../components/ui";
import type { TicketType, TicketPriority } from "../../types/Ticket";

const typeOptions: { value: string; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "task", label: "Task" },
  { value: "other", label: "Khác" },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const { createTicket, loading } = useTicketStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Vui lòng nhập tiêu đề";
    if (!description.trim()) next.description = "Vui lòng nhập mô tả";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createTicket(
      {
        title: title.trim(),
        description: description.trim(),
        type: (type || undefined) as TicketType | undefined,
        priority: (priority || undefined) as TicketPriority | undefined,
        tags: tags.length > 0 ? tags : undefined,
      },
      files.length > 0 ? files : undefined,
    );

    if (result) {
      navigate(`/support/tickets/${result._id}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-notion-text-secondary hover:text-notion-text transition-colors cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M19 12H5" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Quay lại
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-notion-text">
          Tạo ticket mới
        </h1>
        <p className="mt-1.5 text-sm text-notion-text-secondary">
          Mô tả vấn đề bạn đang gặp phải. Đội ngũ hỗ trợ sẽ phản hồi trong thời
          gian sớm nhất.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-notion-border bg-notion-bg p-6 shadow-notion-sm space-y-5">
          {/* Title */}
          <Input
            label="Tiêu đề"
            name="title"
            placeholder="Ví dụ: Không thể đăng nhập vào tài khoản"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title)
                setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            error={errors.title}
            wrapperClassName="w-full"
          />

          {/* Description */}
          <Textarea
            label="Mô tả chi tiết"
            name="description"
            placeholder="Mô tả vấn đề bạn đang gặp phải càng chi tiết càng tốt..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            error={errors.description}
            rows={6}
            wrapperClassName="w-full"
          />

          {/* Type & Priority row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Loại ticket"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Chọn loại ticket"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            <Select
              label="Mức độ ưu tiên"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Chọn mức độ ưu tiên"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Tags */}
          <Input
            label="Tags (phân cách bằng dấu phẩy)"
            name="tags"
            placeholder="Ví dụ: urgent, login, bug"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            hint="Tags giúp phân loại và tìm kiếm ticket dễ dàng hơn"
            wrapperClassName="w-full"
          />

          {/* File upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-notion-text">
              Tệp đính kèm (tuỳ chọn)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-notion-border bg-notion-surface px-4 py-2 text-sm text-notion-text-secondary hover:bg-notion-surface-hover transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Chọn tệp
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const selected = Array.from(e.target.files || []);
                    setFiles((prev) => [...prev, ...selected]);
                  }}
                />
              </label>
              {files.length > 0 && (
                <span className="text-sm text-notion-text-secondary">
                  {files.length} tệp đã chọn
                </span>
              )}
            </div>
            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-md bg-notion-blue-bg px-2.5 py-1 text-xs text-notion-blue-text"
                  >
                    {file.name}
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="cursor-pointer hover:text-notion-red-text transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="size-3"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="lg"
            type="button"
            onClick={() => navigate(-1)}
          >
            Huỷ
          </Button>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Gửi ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketPage;
