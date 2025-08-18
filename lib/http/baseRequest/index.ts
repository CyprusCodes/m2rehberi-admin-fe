import axios, { AxiosPromise } from "axios";
import qs from "qs";
import Authentication from "../../../services/authentication";

let auth: any;

const buildHeaders = () => {
  if (!auth) {
    auth = new Authentication();
  }

  const authenticated = auth.isAuthenticated();
  if (authenticated) {
    const token = auth.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=UTF-8",
    };
  } else {
    return {};
  }
};

const baseRequest = <T = any>(url: string, options = {}) => {
  const { headers = {}, method = "get", ...opts }: any = options;
  return axios(url, {
    method: method,
    headers: { ...buildHeaders(), ...headers },
    ...opts,
    paramsSerializer: function (params) {
      return qs.stringify(params, { encode: false, arrayFormat: "indices" });
    },
  }) as AxiosPromise<T>;
};

enum RequestMethod {
  get = "get",
  post = "post",
  put = "put",
  patch = "patch",
  delete = "delete",
}

export const baseRequestWithFormData = (
  url: string,
  formData: any,
  options: any = {}
) => {
  const { headers = {}, ...opts }: any = options;
  const method: RequestMethod = options.method || "get";

  return axios[method](url, formData, {
    headers: { ...buildHeaders(), ...headers },
    ...opts,
  });
};

export default baseRequest;
