import { Session } from "@/types/session";
import { Status } from "@/types/global";
import { DeliveryType, Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { Product } from "@/types/product";
import { Promotion } from "@/types/promotion";
import { Restaurant } from "@/types/restaurant";
import { Ingredient, Supplier } from "@/types/stock";
import { User } from "@/types/user";

import {
  allergens,
  baskets,
  categories,
  deliveries,
  embedIngredientRestaurant,
  embedOrder,
  embedPayment,
  embedSupplyOrder,
  FlatIngredientRestaurant,
  FlatSupplyOrder,
  ingredientRestaurants,
  ingredients,
  MockUser,
  orders,
  payments,
  products,
  promotions,
  restaurants,
  suppliers,
  supplyOrders,
  users,
} from "@/lib/mocks/data";
import { decodeToken, signToken, TokenPayload } from "@/lib/mocks/token";

type MockResult = { status: number; body: unknown };
type HandlerCtx = { params: Record<string, string>; body: Record<string, unknown> | undefined; auth?: TokenPayload };
type Handler = (ctx: HandlerCtx) => MockResult;

const ok = (body: unknown, status = 200): MockResult => ({ status, body });
const notFound = (message = "Not found"): MockResult => ({ status: 404, body: { message } });
const unauthorized = (): MockResult => ({ status: 401, body: { message: "Unauthorized" } });
const forbidden = (): MockResult => ({ status: 403, body: { message: "Forbidden" } });

const hasRole = (auth: TokenPayload | undefined, roles: string | string[]) => {
  if (!auth) return false;
  return (Array.isArray(roles) ? roles : [roles]).includes(auth.role);
};

const guard = (auth: TokenPayload | undefined, roles?: string | string[]): MockResult | null => {
  if (!auth) return unauthorized();
  if (roles && !hasRole(auth, roles)) return forbidden();
  return null;
};

const nextNumericId = (items: { id: number }[]) => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);
const emptyBasket = () => ({ productsList: [], restaurantId: "" });

type RouteDef = { method: string; segments: string[]; handler: Handler };
const routes: RouteDef[] = [];
const route = (method: string, pattern: string, handler: Handler) =>
  routes.push({ method, segments: pattern.split("/").filter(Boolean), handler });

// ---- user ----
route("POST", "/api/user/login", ({ body }) => {
  const { email, password } = body ?? {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { status: 401, body: { message: "Invalid credentials" } };
  return ok({ user, token: signToken(user), error: null });
});

route("POST", "/api/user/register", ({ body }) => {
  const { firstName, lastName, email, password, phone, country, zipCode, street, lat, lng, roleCode } = body ?? {};
  const id = `user-${users.length + 1}`;
  const addressId = 2000 + users.length;
  const role = (roleCode as string) ?? "USER";
  const user: MockUser = {
    id,
    firstName: firstName as string,
    lastName: lastName as string,
    email: email as string,
    password: password as string,
    phone: phone as string,
    mainaddressid: String(addressId),
    mainaddress: { id: addressId, street: street as string, zipcode: zipCode as string, country: country as string, city: "", lat: lat as number, lng: lng as number },
    roleid: 3,
    role: { id: 3, code: role as User["role"]["code"], label: role },
  };
  users.push(user);
  return ok(user, 201);
});

route("GET", "/api/user", ({ auth }) => {
  const g = guard(auth, "ADMIN");
  if (g) return g;
  return ok({ usersList: users });
});

route("GET", "/api/user/:id", ({ params }) => {
  const user = users.find((u) => u.id === params.id);
  if (!user) return notFound();
  return ok({ ...user, notifications: [] });
});

route("PUT", "/api/user/password", ({ body, auth }) => {
  const g = guard(auth);
  if (g) return g;
  const user = users.find((u) => u.id === auth!.id);
  if (!user) return notFound();
  const { oldpassword, password } = body ?? {};
  if (user.password !== oldpassword) return { status: 403, body: { message: "Wrong password" } };
  user.password = password as string;
  return ok(user);
});

// ADMIN can change anyone's role; a user can also self-serve "become a delivery person".
route("PUT", "/api/user/:id/role", ({ params, body, auth }) => {
  const g = guard(auth);
  if (g) return g;
  if (!(hasRole(auth, "ADMIN") || auth!.id === params.id)) return forbidden();
  const user = users.find((u) => u.id === params.id);
  if (!user) return notFound();
  const code = body?.role as User["role"]["code"];
  user.role = { id: user.roleid, code, label: code };
  return ok(user);
});

route("PUT", "/api/user/main-address/:id", ({ params, body, auth }) => {
  const g = guard(auth);
  if (g) return g;
  const user = users.find((u) => String(u.mainaddress.id) === params.id);
  if (!user) return notFound();
  Object.assign(user.mainaddress, body);
  return ok(user.mainaddress);
});

// ---- basket ----
route("GET", "/api/basket", ({ auth }) => {
  const g = guard(auth);
  if (g) return g;
  return ok(baskets.get(auth!.id) ?? emptyBasket());
});

route("POST", "/api/basket", ({ body, auth }) => {
  const g = guard(auth);
  if (g) return g;
  const { productId, quantity, restaurantId } = body ?? {};
  if (!((quantity as number) > 0)) return { status: 400, body: { message: "Quantity must be greater than 0" } };
  const basket = baskets.get(auth!.id) ?? emptyBasket();
  if (restaurantId) basket.restaurantId = restaurantId as string;
  const existing = basket.productsList.find((p) => p.id === productId);
  if (existing) existing.quantity += quantity as number;
  else basket.productsList.push({ id: productId as string, quantity: quantity as number });
  baskets.set(auth!.id, basket);
  return ok(basket);
});

route("PUT", "/api/basket/remove", ({ body, auth }) => {
  const g = guard(auth);
  if (g) return g;
  const { productId, quantity } = body ?? {};
  if (!((quantity as number) > 0)) return { status: 400, body: { message: "Quantity must be greater than 0" } };
  const basket = baskets.get(auth!.id) ?? emptyBasket();
  const existing = basket.productsList.find((p) => p.id === productId);
  if (existing) {
    existing.quantity -= quantity as number;
    if (existing.quantity <= 0) basket.productsList = basket.productsList.filter((p) => p.id !== productId);
  }
  baskets.set(auth!.id, basket);
  return ok(basket);
});

route("PUT", "/api/basket/restaurant", ({ body, auth }) => {
  const g = guard(auth);
  if (g) return g;
  const basket = baskets.get(auth!.id) ?? emptyBasket();
  basket.restaurantId = body?.restaurantId as string;
  baskets.set(auth!.id, basket);
  return ok(basket);
});

route("POST", "/api/basket/reset", ({ auth }) => {
  const g = guard(auth);
  if (g) return g;
  const basket = emptyBasket();
  baskets.set(auth!.id, basket);
  return ok(basket);
});

// ---- payment / stripe ----
route("POST", "/api/payment/stripe", ({ body, auth }) => {
  const now = new Date().toISOString();
  const payment = {
    id: `payment-${payments.length + 1}`,
    stripe_id: `pi_mock_${Date.now()}`,
    total: Number(body?.total ?? 0),
    status: PaymentStatus.APPROVED,
    user_id: (body?.user_id as string) ?? (body?.userId as string) ?? auth?.id ?? "",
    created_at: now,
    updated_at: now,
  };
  payments.push(payment);
  const secret = `${payment.stripe_id}_secret_mock`;
  return ok({ ...embedPayment(payment), clientsecret: secret, client_secret: secret, amount: payment.total, currency: "eur" }, 201);
});

// ---- order ----
route("GET", "/api/order/by-user/:userId", ({ params }) => {
  const list = orders.filter((o) => o.userId === params.userId).map(embedOrder);
  return ok({ ordersList: list });
});

route("GET", "/api/order/by-restaurant/:id", ({ params, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const list = orders.filter((o) => o.restaurantId === params.id).map(embedOrder);
  return ok({ ordersList: list });
});

route("GET", "/api/order/by-payment/:paymentId", ({ params }) => {
  const order = orders.find((o) => o.paymentId === params.paymentId);
  if (!order) return notFound();
  return ok(embedOrder(order));
});

route("PUT", "/api/order/claim/:id", ({ params }) => {
  const order = orders.find((o) => o.id === params.id);
  if (!order) return notFound();
  order.status = Status.IN_PROGRESS;
  return ok(embedOrder(order));
});

route("PUT", "/api/order/:id", ({ params, body, auth }) => {
  const g = guard(auth, "ADMIN");
  if (g) return g;
  const order = orders.find((o) => o.id === params.id);
  if (!order) return notFound();
  Object.assign(order, body, { updated_at: new Date().toISOString() });
  return ok(embedOrder(order));
});

route("GET", "/api/order/:id", ({ params }) => {
  const order = orders.find((o) => o.id === params.id);
  if (!order) return notFound();
  return ok(embedOrder(order));
});

route("POST", "/api/order", ({ body, auth }) => {
  const fallbackUser = users.find((u) => u.role.code === "USER")!;
  const order = {
    id: `order-${orders.length + 1}`,
    deliveryType: (body?.deliveryType as DeliveryType) ?? DeliveryType.DELIVERY,
    restaurantId: (body?.restaurantId as string) ?? restaurants[0].id,
    userId: (body?.userId as string) ?? auth?.id ?? fallbackUser.id,
    basketSnapshot: (body?.basketSnapshot as Order["basketSnapshot"]) ?? { string: "{}", json: {}, total: 0 },
    status: (body?.status as Status) ?? Status.PENDING,
    paymentId: (body?.paymentId as string) ?? payments[0].id,
    deliveryId: (body?.deliveryId as string) ?? deliveries[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  orders.push(order);
  return ok(embedOrder(order), 201);
});

// ---- product / category / allergen ----
route("GET", "/api/product/by-restaurant/:id", ({ params }) => ok({ productsList: products.filter((p) => p.restaurantId === params.id) }));

route("GET", "/api/product/:id", ({ params }) => {
  const p = products.find((pr) => pr.id === params.id);
  return p ? ok(p) : notFound();
});

route("POST", "/api/product", ({ body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const p: Product = { id: `product-${products.length + 1}`, categoriesList: [], allergensList: [], recipeList: [], ...body } as unknown as Product;
  products.push(p);
  return ok(p, 201);
});

route("PUT", "/api/product/:id", ({ params, body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const p = products.find((pr) => pr.id === params.id);
  if (!p) return notFound();
  Object.assign(p, body);
  return ok(p);
});

route("DELETE", "/api/product/:id", ({ params, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const index = products.findIndex((pr) => pr.id === params.id);
  if (index === -1) return notFound();
  const [removed] = products.splice(index, 1);
  return ok(removed);
});

route("GET", "/api/category", () => ok({ categoriesList: categories }));
route("GET", "/api/category/:id", ({ params }) => {
  const c = categories.find((x) => x.id === params.id);
  return c ? ok(c) : notFound();
});

route("GET", "/api/allergen", () => ok({ allergensList: allergens }));
route("GET", "/api/allergen/:id", ({ params }) => {
  const a = allergens.find((x) => x.id === params.id);
  return a ? ok(a) : notFound();
});

// ---- restaurant ----
route("GET", "/api/restaurant", () => ok({ restaurantsList: restaurants }));
route("POST", "/api/restaurant/by-location", () => ok({ restaurantsList: restaurants }));

route("GET", "/api/restaurant/:id/users", ({ params }) => {
  const r = restaurants.find((x) => x.id === params.id);
  if (!r) return notFound();
  return ok({ usersList: users.filter((u) => r.useridsList.includes(u.id)) });
});

route("GET", "/api/restaurant/:id", ({ params }) => {
  const r = restaurants.find((x) => x.id === params.id);
  return r ? ok(r) : notFound();
});

route("POST", "/api/restaurant", ({ body, auth }) => {
  const g = guard(auth, "ADMIN");
  if (g) return g;
  const now = new Date().toISOString();
  const r: Restaurant = { id: `restaurant-${restaurants.length + 1}`, createdat: now, updatedat: now, openinghoursList: [], useridsList: [], ...body } as unknown as Restaurant;
  restaurants.push(r);
  return ok(r, 201);
});

route("PUT", "/api/restaurant/:id", ({ params, body, auth }) => {
  const g = guard(auth, ["ADMIN", "MANAGER"]);
  if (g) return g;
  const r = restaurants.find((x) => x.id === params.id);
  if (!r) return notFound();
  Object.assign(r, body, { updatedat: new Date().toISOString() });
  return ok(r);
});

route("DELETE", "/api/restaurant/:id", ({ params, auth }) => {
  const g = guard(auth, "ADMIN");
  if (g) return g;
  const index = restaurants.findIndex((x) => x.id === params.id);
  if (index === -1) return notFound();
  const [removed] = restaurants.splice(index, 1);
  return ok(removed);
});

// ---- promotion ----
// GET by-restaurant is also used by regular customers browsing codes promos, not just admins.
route("GET", "/api/promotion/by-restaurant/:id", ({ params, auth }) => {
  const g = guard(auth);
  if (g) return g;
  return ok({ promotionsList: promotions.filter((p) => p.restaurantId === params.id) });
});

route("GET", "/api/promotion", ({ auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  return ok({ promotionsList: promotions });
});

route("POST", "/api/promotion", ({ body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const p: Promotion = { id: `promotion-${promotions.length + 1}`, ...body } as unknown as Promotion;
  promotions.push(p);
  return ok(p, 201);
});

route("PUT", "/api/promotion/:id", ({ params, body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const p = promotions.find((x) => x.id === params.id);
  if (!p) return notFound();
  Object.assign(p, body);
  return ok(p);
});

route("DELETE", "/api/promotion/:id", ({ params, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const index = promotions.findIndex((x) => x.id === params.id);
  if (index === -1) return notFound();
  const [removed] = promotions.splice(index, 1);
  return ok(removed);
});

// ---- stock: supplier / ingredient / ingredient-restaurant / supply-order ----
route("GET", "/api/stock/supplier", ({ auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  return ok({ suppliersList: suppliers });
});

route("POST", "/api/stock/supplier", ({ body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const s: Supplier = { id: nextNumericId(suppliers), ...body } as unknown as Supplier;
  suppliers.push(s);
  return ok(s, 201);
});

route("PUT", "/api/stock/supplier/:id", ({ params, body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const s = suppliers.find((x) => String(x.id) === params.id);
  if (!s) return notFound();
  Object.assign(s, body);
  return ok(s);
});

route("GET", "/api/stock/ingredient", ({ auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  return ok({ ingredientsList: ingredients });
});

route("POST", "/api/stock/ingredient", ({ body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const i: Ingredient = { id: nextNumericId(ingredients), description: null, ...body } as unknown as Ingredient;
  ingredients.push(i);
  return ok(i, 201);
});

route("DELETE", "/api/stock/ingredient/:id", ({ params, auth }) => {
  const g = guard(auth, "ADMIN");
  if (g) return g;
  const index = ingredients.findIndex((x) => String(x.id) === params.id);
  if (index === -1) return notFound();
  const [removed] = ingredients.splice(index, 1);
  return ok(removed);
});

route("GET", "/api/stock/ingredient/restaurant/by-restaurant/:id", ({ params, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const list = ingredientRestaurants.filter((ir) => ir.restaurantId === params.id).map(embedIngredientRestaurant);
  return ok({ ingredientRestaurantsList: list });
});

route("POST", "/api/stock/ingredient/restaurant", ({ body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const ir: FlatIngredientRestaurant = { id: nextNumericId(ingredientRestaurants), inProductListList: [], updatedAt: new Date().toISOString(), ...body } as unknown as FlatIngredientRestaurant;
  ingredientRestaurants.push(ir);
  return ok(embedIngredientRestaurant(ir), 201);
});

route("PUT", "/api/stock/ingredient/restaurant/:id", ({ params, body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const ir = ingredientRestaurants.find((x) => String(x.id) === params.id);
  if (!ir) return notFound();
  Object.assign(ir, body, { updatedAt: new Date().toISOString() });
  return ok(embedIngredientRestaurant(ir));
});

route("GET", "/api/stock/supply/order/by-restaurant/:id", ({ params, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const irIds = ingredientRestaurants.filter((ir) => ir.restaurantId === params.id).map((ir) => ir.id);
  const list = supplyOrders.filter((so) => irIds.includes(so.ingredientRestaurantId)).map(embedSupplyOrder);
  return ok({ supplyOrdersList: list });
});

route("POST", "/api/stock/supply/order", ({ body, auth }) => {
  const g = guard(auth, ["MANAGER", "ADMIN"]);
  if (g) return g;
  const now = new Date().toISOString();
  const so: FlatSupplyOrder = { id: nextNumericId(supplyOrders), createdAt: now, updatedAt: now, ...body } as unknown as FlatSupplyOrder;
  supplyOrders.push(so);
  return ok(embedSupplyOrder(so), 201);
});

// ---- misc ----
const HEALTH_SERVICES = [
  "basketService",
  "deliveryService",
  "orderService",
  "paymentService",
  "productService",
  "promotionService",
  "restaurantService",
  "stockService",
  "userService",
];
route("GET", "/api/health-check", () =>
  ok(Object.fromEntries(HEALTH_SERVICES.map((name) => [name, { responseTime: 12, ok: true }]))),
);

// ---- dispatch ----
const matchSegments = (routeSegments: string[], pathSegments: string[]): Record<string, string> | null => {
  if (routeSegments.length !== pathSegments.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < routeSegments.length; i++) {
    const rs = routeSegments[i];
    const ps = decodeURIComponent(pathSegments[i]);
    if (rs.startsWith(":")) params[rs.slice(1)] = ps;
    else if (rs !== ps) return null;
  }
  return params;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockRequest = async (
  url: string,
  token: Session["token"] | null | undefined,
  options?: RequestInit,
): Promise<Response> => {
  const method = (options?.method ?? "GET").toUpperCase();
  const [path] = url.split("?");
  const pathSegments = path.split("/").filter(Boolean);
  const body = typeof options?.body === "string" ? JSON.parse(options.body) : undefined;
  const auth = decodeToken(token);

  await delay(120);

  for (const r of routes) {
    if (r.method !== method) continue;
    const params = matchSegments(r.segments, pathSegments);
    if (!params) continue;
    const { status, body: resBody } = r.handler({ params, body, auth });
    return new Response(JSON.stringify(resBody), { status, headers: { "content-type": "application/json" } });
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(`[mock] no handler for ${method} ${path}`);
  }
  return new Response(JSON.stringify({ message: "Not found" }), { status: 404, headers: { "content-type": "application/json" } });
};
