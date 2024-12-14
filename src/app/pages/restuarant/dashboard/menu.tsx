import { Card, CardContent } from "@/components/ui/card";
import { Circle, IndianRupee, Plus, ShoppingBasket, Soup, Triangle, Vegan } from "lucide-react";
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { ingredientsList } from "./restuarantData";
import { MultiSelect } from "@/components/ui/multiselect";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function menu() {
  const [isVeg, setIsVeg] = useState(true);
  const [hasMenu, sethasMenu] = useState(false);
  const [selectedFrameworks, setSelectedIngredients] = useState<string[]>([]);


  const formFields = [
    {
      id: 'dishName',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Mutton Soup',
      icon: Soup,
      required: true,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'picture',
      label: 'Picture',
      type: 'file',
      placeholder: 'Upload item picture',
      icon: 'none',
      required: true,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'isVeg',
      label: 'Veg or Non Veg',
      type: 'toggle',
      placeholder: 'Mutton Soup',
      icon: Vegan,
      required: true,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter The Price',
      icon: IndianRupee,
      required: true,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      type: 'text',
      required: true,
      placeholder: 'Add ingredients',
      icon: ShoppingBasket,
      validation: () => ''
    }
  ];

  return (
    <>
      <Dialog defaultOpen={false} >
        {!hasMenu ? (
          <div className="flex items-center w-100 justify-center md:h-[100%]">
            <Card className="md:w-[700px] h-96 bg-red-50">
              <CardContent className="flex flex-col items-center justify-center h-full text-center p-6 ">
                <DialogTrigger>
                  <div className="bg-red-100 p-4 rounded-full mb-4 cursor-pointer">
                    <Plus size={48} className="text-red-500" />
                  </div>
                </DialogTrigger>
                <p className="text-gray-700 mb-4">
                  Add Menus, You don't have any menus yet!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <p>Render menu</p>
          </>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-y-3">
              {formFields.map((field, index) => {
                return (
                  <div key={index} className={`space-y-2 ${field.id === "ingredients" ? "col-span-full" : ""}`}>
                    {field.id === "ingredients" ? (
                      <>
                        <Label htmlFor={field.id} className="text-sm font-medium block">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <MultiSelect
                          className="px-10 md:py-8 h-12 w-full rounded-none bg-white"
                          options={ingredientsList}
                          onValueChange={setSelectedIngredients}
                          placeholder="Select Ingredients"
                          variant="rmscolor"
                          animation={2}
                          maxCount={7}
                        />
                      </>
                    ) : field.type === "toggle" ? (
                      <>
                        <Label htmlFor={field.id} className="text-sm font-medium block">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="flex gap-4">
                          <Button className={`${isVeg ? "bg-green-600 text-white hover:bg-green-600" : "bg-green-200 hover:bg-green-200 text-green-600"}`} onClick={() => setIsVeg(!isVeg)}><Circle /></Button>
                          <Button className={`${!isVeg ? "bg-red-600 text-white hover:bg-red-600" : "bg-red-200 hover:bg-red-200  text-red-600"}`} onClick={() => setIsVeg(!isVeg)}><Triangle /></Button>
                        </div>

                      </>

                    )
                      : (
                        <>
                          <Label htmlFor={field.id} className="text-sm font-medium block">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          <div className="relative">
                            {field.type !== "file" && (
                              <field.icon className="absolute left-3 md:top-8 top-6 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            )}
                            <Input
                              id={field.id}
                              type={field.type}
                              placeholder={field.placeholder}
                              className="px-10 md:py-8 h-12 w-full rounded-none bg-white hover:shadow-md"
                            />
                          </div>
                        </>
                      )}
                  </div>
                );
              })}
            </div>
          </DialogDescription>
          <Button className="bg-swiggyOrange p-5 hover:bg-orange-500 rounded-none">Save</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default menu