import MediaManagerModal from "@/core/components/sidepanels/panels/images/media-manager-modal";
import { ChaiAsset } from "@/types";
import { WidgetProps } from "@rjsf/utils/lib/index.js";
import { first, get, set, has, isArray, isEmpty } from "lodash-es";
import { Edit2Icon, X } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLanguages, useSelectedBlock, useUpdateBlocksProps } from "../hooks";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2Q1ZDdkYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==";

const stripCssUrl = (val?: string): string => {
  if (!val || typeof val !== "string") return val as any;
  const match = val.match(/^\s*url\((['\"]?)(.*?)\1\)\s*$/i);
  return match ? match[2] : val;
};

const ImagePickerField = ({ value, onChange, id, onBlur }: WidgetProps) => {
  const { t } = useTranslation();
  const { selectedLang } = useLanguages();
  const selectedBlock = useSelectedBlock();
  const updateBlockProps = useUpdateBlocksProps();
  const showImagePicker = true;

  const propKey = id.split(".").pop() || "";
  const propIdKey = selectedLang ? `_${propKey}Id-${selectedLang}` : `_${propKey}Id`;

  const hasImageBlockAssetId =
    isEmpty(selectedLang) && selectedBlock?._type === "Image" && has(selectedBlock, "assetId");

  const assetId = get(selectedBlock, propIdKey, hasImageBlockAssetId ? selectedBlock?.assetId : "");
  const showRemoveIcons = !!assetId;

  const handleSelect = (assets: ChaiAsset[] | ChaiAsset) => {
    const asset = isArray(assets) ? first(assets) : assets;
    if (asset) {
      onChange(asset?.url);
      const width = asset?.width;
      const height = asset?.height;
      if (selectedBlock?._id) {
        const props = {
          ...(width && { width: width }),
          ...(height && { height: height }),
          ...(asset.description && { alt: asset.description }),
          // Persist a generic mediaReference so the server stores the association reliably
          mediaReference: {
            mediaRecordId: asset?.id ? Number(asset.id) : undefined,
            mediaToken: undefined,
            fallbackUrl: asset?.url,
          },
        };
        // handling asset id based on prop
        set(props, propIdKey, asset.id);
        // Only update if props are not empty
        if (isEmpty(props)) return;
        updateBlockProps([selectedBlock._id], props);
      }
    }
  };

  const clearImage = useCallback(() => {
    onChange(PLACEHOLDER_IMAGE);
    if (selectedBlock?._id) {
      updateBlockProps([selectedBlock._id], { assetId: "" });
    }
  }, [onChange, selectedBlock?._id, updateBlockProps]);

  // Normalize any css url(...) values that may sneak into the saved value
  const normalizedValue = stripCssUrl(value as any);

  return (
    <div className="mt-1.5 flex items-center gap-x-3">
      {normalizedValue ? (
        <div className="group relative">
          <img
            src={normalizedValue}
            className={
              `h-20 w-20 overflow-hidden rounded-md border border-border object-cover transition duration-200 ` +
              (assetId && assetId !== "" ? "cursor-pointer group-hover:blur-sm" : "")
            }
            alt=""
          />
          {showRemoveIcons && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-2 -top-2 z-20 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90">
              <X className="h-3 w-3" />
            </button>
          )}
          {assetId && assetId !== "" && (
            <MediaManagerModal onSelect={handleSelect} assetId={assetId}>
              <button
                type="button"
                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/10 opacity-0 transition duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                <Edit2Icon className="h-4 w-4 text-white" />
              </button>
            </MediaManagerModal>
          )}
        </div>
      ) : (
        <MediaManagerModal onSelect={handleSelect} mode="image" assetId={assetId}>
          <div className="h-20 w-20 cursor-pointer rounded-md border border-border bg-[radial-gradient(#AAA,transparent_1px)] duration-300 [background-size:10px_10px]"></div>
        </MediaManagerModal>
      )}
      <div className="flex w-3/5 flex-col">
        {showImagePicker && (
          <>
            <MediaManagerModal onSelect={handleSelect} assetId="">
              <small className="h-6 cursor-pointer rounded-md bg-secondary px-2 py-1 text-center text-xs text-secondary-foreground hover:bg-secondary/80">
                {normalizedValue || !isEmpty(normalizedValue) ? t("Replace image") : t("Choose image")}
              </small>
            </MediaManagerModal>
            <small className="-pl-4 pt-2 text-center text-xs text-secondary-foreground">OR</small>
          </>
        )}
        <input
          id={id}
          autoCapitalize={"off"}
          autoCorrect={"off"}
          spellCheck={"false"}
          type="url"
          className="text-xs"
          placeholder={t("Enter image URL")}
          value={normalizedValue || ""}
          onBlur={({ target: { value: url } }) => onBlur(id, stripCssUrl(url))}
          onChange={(e) => onChange(stripCssUrl(e.target.value))}
        />
      </div>
    </div>
  );
};

export { ImagePickerField };
