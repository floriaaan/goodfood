import { ProductCreateEditForm, ProductCreateEditFormValues } from "@/components/admin/product/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import {Allergen, Category, Product, Recipe} from "@/types/product";
import {useAdmin} from "@/hooks/useAdmin";
import {useAuth} from "@/hooks";
import {fetchAPI} from "@/lib/fetchAPI";
import {toast} from "@/components/ui/use-toast";
import {MdDone} from "react-icons/md";
import {ToastTitle} from "@radix-ui/react-toast";
import {XIcon} from "lucide-react";
import {toProduct, toUpdateProduct} from "@/lib/product/toProduct";

export const ProductFormSheetContent = ({
                                          initialValues,
                                          id,
                                          closeSheet,
                                        }: {
  initialValues?: ProductCreateEditFormValues;
  id?: Product["id"];
  closeSheet: () => void;
}) => {
  const { refetchProducts } = useAdmin();
  const { session, isAuthenticated } = useAuth();

  const createProduct = async (productInput: Product) => {
    if (!productInput || !isAuthenticated) return;

    console.log(JSON.stringify(productInput));
    const res = await fetchAPI("/api/product", session?.token, {
      method: "POST",
      body: JSON.stringify(productInput),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la création du produit");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>Le produit a été créé avec succès</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  }
  const updateProduct = async (productInput: Product) => {
    if (!productInput || !productInput.id || !isAuthenticated) return;

    const res = await fetchAPI(`/api/product/${productInput.id}`, session?.token, {
      method: "PUT",
      body: JSON.stringify( productInput ),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la mise à jour du restaurant");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>Le produit a été mis à jour avec succès</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  }

  const getProduct = async (id : string) => {
    if (!id || !isAuthenticated) return;

    const res = await fetchAPI(`/api/product/${id}`, session?.token);
    return await res.json() as Promise<Product>;
  }

  const getAllergen = async (id : string) => {
    if (!id || !isAuthenticated) return;

    const res = await fetchAPI(`/api/allergen/${id}`, session?.token);
    return await res.json() as Allergen;
  }

  const getCategory = async (id : string) => {
    if (!id || !isAuthenticated) return;

    const res = await fetchAPI(`/api/category/${id}`, session?.token);
    return await res.json() as Category;
  }

  const onSubmit = async (values: ProductCreateEditFormValues) => {
    try {
      const categoryList = await Promise.all(values?.categoriesList?.map((categoryId) => getCategory(categoryId)) as unknown as Promise<Category>[]);
      const allergenList = await Promise.all(values?.allergensList?.map((allergenId) => getAllergen(allergenId)) as unknown as Promise<Allergen>[]);
      const recipeList = values.recipeList as Recipe[];
      if (!id){
        const product = toProduct(values, categoryList, allergenList, recipeList)
        console.log(product);
        createProduct(product);
      }
      else{
        const product = await getProduct(id);
        if(product)
          updateProduct(toUpdateProduct(product, values, categoryList, allergenList, recipeList));
        else
          throw new Error("Le produit n'existe pas");
      }
      closeSheet();
      refetchProducts();
    } catch (err) {
      console.log((err as Error).message ?? "Une erreur est survenue.");
      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <XIcon className="h-6 w-6 text-red-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>{(err as Error).message ?? "Une erreur est survenue."}</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    }
  };

  const onImageChange = (file: File) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("https://picsum.photos/200/300");
      }, 1000);
    });
  };

  return (
    <SheetContent side="right" className="w-full border-l-0 sm:max-w-xl">
      <div className="flex h-full w-full">
        <ProductCreateEditForm {...{ onSubmit, onImageChange, initialValues, id, closeSheet }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};
