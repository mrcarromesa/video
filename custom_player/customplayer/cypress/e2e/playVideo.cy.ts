describe("empty spec", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:6006/iframe.html?viewMode=story&id=progressbar-example-media--media-element"
    ).wait(1500);
  });
  it("passes", (done) => {
    cy.idCy("playVideo").click();
    cy.get("#va").should("have.prop", "paused", false);
    done();

    // console.log("canPlay", canPlay);
    // cy.get("#playVideo").click();
  });
  it("passes1", (done) => {
    cy.get("#va").should("have.prop", "paused", true);
    done();
  });
  it("passes2", () => {
    cy.get("[data-cy='playProgress']").trigger("mousedown", {
      which: 1,
      pageX: 400,
    });
    cy.get("[data-cy='playProgress']").trigger("mousemove", {
      which: 1,
      pageX: 500,
    });
    cy.get("[data-cy='playProgress']").trigger("mouseup");
    cy.get("#va").then(($element) => {
      expect(($element[0] as HTMLVideoElement).currentTime).to.above(50);
    });
  });
});
