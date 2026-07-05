import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useTicketStore from "../../stores/useTicketStore";
import { Button, Input, Textarea, Select } from "../../components/ui";
import type { TicketType, TicketPriority } from "../../types/Ticket";

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    if (!title.trim()) next.title = t("auth.error_required");
    if (!description.trim()) next.description = t("auth.error_required");
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

  const typeOptions: { value: string; label: string }[] = [
    { value: "bug", label: t("ticket.filter_type_bug") },
    { value: "feature", label: t("ticket.filter_type_feature") },
    { value: "task", label: t("ticket.filter_type_task") },
    { value: "other", label: t("ticket.filter_type_other") },
  ];

  const priorityOptions: { value: string; label: string }[] = [
    { value: "low", label: t("ticket.filter_priority_low") },
    { value: "medium", label: t("ticket.filter_priority_medium") },
    { value: "high", label: t("ticket.filter_priority_high") },
  ];

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
        {t("ticket.back")}
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-notion-text">
          {t("ticket.title_create")}
        </h1>
        <p className="mt-1.5 text-sm text-notion-text-secondary">
          {t("ticket.subtitle_create")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-notion-border bg-notion-bg p-6 shadow-notion-sm space-y-5">
          {/* Title */}
          <Input
            label={t("ticket.form_title_label")}
            name="title"
            placeholder={t("ticket.form_title_placeholder")}
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
            label={t("ticket.form_description_label")}
            name="description"
            placeholder={t("ticket.form_description_placeholder")}
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
              label={t("ticket.form_type_label")}
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder={t("ticket.form_type_placeholder")}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            <Select
              label={t("ticket.form_priority_label")}
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder={t("ticket.form_priority_placeholder")}
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
            label={t("ticket.form_tags_label")}
            name="tags"
            placeholder={t("ticket.form_tags_placeholder")}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            hint={t("ticket.form_tags_hint")}
            wrapperClassName="w-full"
          />

          {/* File upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-notion-text">
              {t("ticket.form_attachments_label")}
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
                {t("ticket.form_attachments_button")}
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
                  {t("ticket.form_attachments_files_selected", { count: files.length })}
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
            {t("ticket.form_cancel")}
          </Button>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {t("ticket.form_submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketPage;
