import { Checkbox } from "@mui/material";
import Image from "next/image";
import React from "react";


const ModalMediaBlock = ({
  media,
  selectMedia,
  setSelectMedia,
  isMultiple,
}) => {
  const handleCheckedChange = () => {
    let newSelectedMedia = [];
    const isSelected = selectMedia.find((item) => item._id === media._id)
      ? true
      : false;
    if (isMultiple) {
      if (isSelected) {
        newSelectedMedia = selectMedia.filter((item) => item._id !== media._id);
      } else {
        newSelectedMedia = [
          ...selectMedia,
          {
            _id: media._id,
            url: media.secure_url,
          },
        ];
      }
      setSelectMedia(newSelectedMedia)
    } else {
        setSelectMedia([
            {
                _id: media._id,
                url: media.secure_url,
            },
        ])
    }
  };
  return (
    <label
      htmlFor={media._id}
      className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 top-0 left-0 z-20">
        <Checkbox
          id={media._id}
          checked={
            selectMedia.find((item) => item._id === media._id) ? true : false
          }
          onChange={handleCheckedChange}
        ></Checkbox>
      </div>
      <div className="size-full relative z-10">
        <Image
          src={media.secure_url}
          width={300}
          height={300}
          alt={media.public_id}
          className="object-cover md:h-[150px] h-[100px]"
        ></Image>
      </div>
    </label>
  );
};

export default ModalMediaBlock;
