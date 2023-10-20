import * as BucketApi from "../../services/Bucket";

export const bucket = (data) => async (dispatch) => {
  try {
    await BucketApi.uploadImage(data);
  } catch (error) {}
};

export const updateBucket = (filename, data) => async (dispatch) => {
  try {
    await BucketApi.updateImage(filename, data);
  } catch (error) {}
};
