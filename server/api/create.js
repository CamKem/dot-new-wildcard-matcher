import db from "../../database/db";

export default defineEventHandler(async (event) => {
  // get the post data
  const body = await readBody(event)

  // check that the user doesn't already have a record
  const stmt = db.prepare('SELECT slug, user FROM records WHERE user = ?');
  const record = await stmt.get(body.user);

  // if the user already has a record, return the slug
  if (record) {
    return {
      success: false,
      message: `You already have a record! Your slug is ${record.slug}.`
    };
  }

  // create a new record
  const slug = body.slug.toLowerCase().replace(/\s/g, '-');
  const stmt2 = db.prepare('INSERT INTO records (slug, user) VALUES (?, ?)');
  const newRecord = await stmt2.run(slug, body.user);

  // return the slug
  return {
    success: true,
    message: `Your record has been created! Your slug is ${slug}.`,
    newRecord: newRecord
  };

})
