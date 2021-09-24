import moment from "moment";

const { supabase } = require("src/config/configSupabase");

const createCharge = (chargesData) =>
  supabase
    .from("Charge")
    .insert(chargesData)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const deleteCharge = (ID) =>
  supabase
    .from("Charge")
    .delete()
    .match({ ID })
    .then((snapshot) => snapshot.data);

const updateCharge = (chargesData, ID) =>
  supabase
    .from("Charge")
    .update(chargesData)
    .eq("ID", ID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const chargeMount = (userID, mount, refresh) =>
  supabase
    .from("Charge")
    .select("*")
    .eq("ClientID", userID)
    .eq("State", false)
    .order("CreatedAt", { ascending: true })
    .then((snapshot) => {
      let rest = mount;
      return snapshot.data.map((charge, index) => {
        if (rest === 0) return null;

        const result =
          parseInt(charge.Remaining > 0 ? charge.Remaining : charge.Charge) -
          rest;

        rest = result;

        if (rest <= 0) {
          rest = 0;
          return updateCharge(
            { ...charge, State: true, Remaining: rest },
            charge.ID
          ).then(refresh);
        }
        return updateCharge(
          { ...charge, State: false, Remaining: rest },
          charge.ID
        ).then(() => (index + 1 === snapshot.data.length ? refresh() : null));
      });
    });

const chargeAutomatic = () => {
  supabase
    .from("User")
    .select("*")
    .limit(2)
    .then((snapshot) => {
      const users = snapshot.data;
      users.map((user) =>
        supabase
          .from("UserProduct")
          .select("Product(*)")
          .eq("UserID", user.ID)
          .then((produtosSnapshot) => {
            const productos = produtosSnapshot.data;
            let amount = 0;
            productos.map(
              ({ Product: { BasePrice } }) => (amount = BasePrice + amount)
            );
            if (amount === 0) return;

            createCharge({
              Name: "Cobro Mensual",
              CreatedAt: moment().toDate(),
              Charge: amount,
              ClientID: user.ID,
              State: false,
              Remaining: 0,
            });
          })
      );
    })
    .catch(console.error);
};

export {
  createCharge,
  deleteCharge,
  updateCharge,
  chargeMount,
  chargeAutomatic,
};
