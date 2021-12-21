import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React from "react";
import ProductTable from "../Tables/ProductsTable";

const SelectProductModal = ({
  show,
  setShow,
  onFinish,
  productsSelected,
  setProductsSelected,
}) => {
  return (
    <CModal show={show} onClose={setShow} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>
          Selecciona los productos que quieres asignar a este usuario
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ProductTable
          type={"select"}
          productsSelected={productsSelected}
          setProductsSelected={setProductsSelected}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="success" onClick={onFinish}>
          Aceptar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SelectProductModal;
