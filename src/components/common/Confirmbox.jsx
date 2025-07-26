// Utils
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

// Components
import ButtonComponent from "@common/ButtonComponent";

const Confirmbox = ({ isConfirm, closeDialogbox, confirmDialogbox }) => {
  const { t } = useTranslation("msg");
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: "success",
      summary: t("delete_record"),
      detail: t("record_has_been_deleted_successfully"),
      life: 3000,
    });
  };

  useEffect(() => {
    if (isConfirm) {
      confirmDialog({
        group: "headless",
        message: t("delete_confirmation_msg"),
        header: t("are_you_sure"),
        defaultFocus: "accept",
        accept,
      });
    }
  }, [isConfirm]);

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog
        group="headless"
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div className="align-items-center flex flex-col rounded bg-white p-4">
            <div className="text-center">
              <i className="ri-error-warning-line text-[2.5rem]"></i>
            </div>
            <div
              className="mb-2 mt-2 block text-center text-[1.5rem] font-[600]"
              ref={headerRef}
            >
              {message.header}
            </div>
            <p className="mb-0 text-[0.8rem]" ref={contentRef}>
              {message.message}
            </p>
            <div className="mt-8 flex justify-end gap-2" ref={footerRef}>
              <ButtonComponent
                onClick={(event) => {
                  hide(event);
                  closeDialogbox();
                }}
                type="button"
                label={t("cancel")}
                className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
                icon="pi pi-arrow-right"
                iconPos="right"
              />
              <ButtonComponent
                onClick={(event) => {
                  hide(event);
                  accept();
                  confirmDialogbox();
                }}
                type="button"
                label={t("confirm")}
                className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
                icon="pi pi-arrow-right"
                iconPos="right"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Confirmbox;
