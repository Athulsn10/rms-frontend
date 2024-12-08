import { Card, CardContent } from "@/components/ui/card";
import { Plus, ShoppingBasket, Soup } from "lucide-react";
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";

function menu() {
  const [hasMenu, sethasMenu] = useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const ingredientsList = [
    { value: "turmeric", label: "Turmeric" },
    { value: "cumin", label: "Cumin" },
    { value: "coriander", label: "Coriander" },
    { value: "mustard_seeds", label: "Mustard Seeds" },
    { value: "ginger", label: "Ginger" },
    { value: "garlic", label: "Garlic" },
    { value: "green_chilies", label: "Green Chilies" },
    { value: "onions", label: "Onions" },
    { value: "tomatoes", label: "Tomatoes" },
    { value: "curry_leaves", label: "Curry Leaves" },
    { value: "red_chili_powder", label: "Red Chili Powder" },
    { value: "garam_masala", label: "Garam Masala" },
    { value: "fenugreek_leaves", label: "Fenugreek Leaves" },
    { value: "cloves", label: "Cloves" },
    { value: "cardamom", label: "Cardamom" },
    { value: "cinnamon", label: "Cinnamon" },
    { value: "bay_leaves", label: "Bay Leaves" },
    { value: "rice", label: "Rice" },
    { value: "lentils", label: "Lentils" },
    { value: "yogurt", label: "Yogurt" },
  ];

  const formFields = [
    {
      id: 'dishName',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Mutton Soup',
      icon: Soup,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'picture',
      label: 'Item Name',
      type: 'file',
      placeholder: 'Upload item picture',
      icon: Soup,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'isVeg',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Mutton Soup',
      icon: Soup,
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
  ]

  return (
    <>
      <Dialog defaultOpen={false}>
        {!hasMenu ? (
          <div className="flex items-center w-100 justify-center md:h-[100%]">
            <Card className="md:w-[700px] h-96 bg-red-50">
              <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
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
            <DialogDescription>
              <div className="">
              <MultiSelect
              options={ingredientsList}
              onValueChange={setSelectedFrameworks}
              placeholder="Select Ingredients"
              variant="inverted"
              animation={2}
              maxCount={3}/>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default menu