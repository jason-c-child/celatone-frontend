import type { ContractLocalInfo } from "lib/stores/contract";

import { ContractDetailsTemplateModal } from "./ContractDetailsTemplate";

interface EditContractDetailsModalProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}
export const EditContractDetailsModal = ({
  contractLocalInfo,
  triggerElement,
}: EditContractDetailsModalProps) => (
  <ContractDetailsTemplateModal
    title="Edit Contract Details"
    subtitle="Filled information below will be saved on Celatone only and able to edit later."
    contractLocalInfo={contractLocalInfo}
    triggerElement={triggerElement}
  />
);
